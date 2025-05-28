import { getDatabase } from '@src/database.js'
import { AdditionalBehavior, MessageNotFound, MessageState, QueueNotFound } from '@src/contract.js'
import { increaseAbandoned, increaseStatByState } from './increase-queue-stats.js'
import { getQueueConfiguration } from './get-queue-configuration.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { removeMessageAllSlots } from './remvoe-message-all-slots.js'
import { removeMessage } from './remove-message.js'
import { getMessageState } from './get-message-state.js'
import { isNull } from '@blackglory/prelude'

/**
 * @throws {QueueNotFound}
 * @throws {MessageNotFound}
 */
export const abandonMessage = withLazyStatic((
  queueId: string
, messageId: string
, timestamp: number
): {
  state: MessageState
  removed: boolean
} => {
  return lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  , timestamp: number
  ): {
    state: MessageState
    removed: boolean
  } => {
    const config = getQueueConfiguration(queueId)
    if (!config) throw new QueueNotFound()

    const oldMessageState = getMessageState(queueId, messageId)
    if (isNull(oldMessageState)) throw new MessageNotFound()

    lazyStatic(() => getDatabase().prepare<
      {
        queueId: string
        messageId: string
        stateUpdatedAt: number
      }
    , { state: MessageState }
    >(`
      UPDATE mq_message
         SET state = ${MessageState.Abandoned}
           , state_updated_at = $stateUpdatedAt
       WHERE queue_id = $queueId
         AND id = $messageId;
    `), [getDatabase()]).run({
      queueId
    , messageId
    , stateUpdatedAt: timestamp
    })

    increaseStatByState(queueId, oldMessageState, -1)
    increaseAbandoned(queueId, 1)

    let removed = false
    switch (config.behaviorWhenAbandoned) {
      case AdditionalBehavior.RemoveMessage: {
        removed = true

        removeMessage(queueId, messageId)
        increaseAbandoned(queueId, 1)

        break
      }
      case AdditionalBehavior.RemoveAllSlots: {
        removeMessageAllSlots(queueId, messageId)
        
        break
      }
    }

    return {
      state: oldMessageState
    , removed
    }
  }), [getDatabase()])(queueId, messageId, timestamp)
})
