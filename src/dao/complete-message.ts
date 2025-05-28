import { getDatabase } from '@src/database.js'
import { AdditionalBehavior, BadMessageState, MessageNotFound, MessageState, QueueNotFound } from '@src/contract.js'
import { increaseActive, increaseCompleted } from './increase-queue-stats.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { getQueueConfiguration } from './get-queue-configuration.js'
import { getMessageState } from './get-message-state.js'
import { isNull } from 'extra-utils'
import { removeMessageAllSlots } from './remvoe-message-all-slots.js'
import { removeMessage } from './remove-message.js'

/**
 * @throws {QueueNotFound}
 * @throws {MessageNotFound}
 * @throws {BadMessageState}
 */
export const completeMessage = withLazyStatic((
  queueId: string
, messageId: string
, timestamp: number
): { removed: boolean } => {
  return lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  , timestamp: number
  ): { removed: boolean } => {
    const config = getQueueConfiguration(queueId)
    if (!config) throw new QueueNotFound()

    const messageState = getMessageState(queueId, messageId)
    if (isNull(messageState)) throw new MessageNotFound()
    if (messageState !== MessageState.Active) {
      throw new BadMessageState(MessageState.Active)
    }

    lazyStatic(() => getDatabase().prepare<
      {
        queueId: string
        messageId: string
        stateUpdatedAt: number
      }
    >(`
      UPDATE mq_message
         SET state = ${MessageState.Completed}
           , state_updated_at = $stateUpdatedAt
       WHERE queue_id = $queueId
         AND id = $messageId;
    `), [getDatabase()]).run({
      queueId
    , messageId
    , stateUpdatedAt: timestamp
    })

    increaseActive(queueId, -1)
    increaseCompleted(queueId, 1)

    let removed = false
    switch (config.behaviorWhenCompleted) {
      case AdditionalBehavior.RemoveMessage: {
        removed = true

        removeMessage(queueId, messageId)
        increaseCompleted(queueId, 1)

        break
      }
      case AdditionalBehavior.RemoveAllSlots: {
        removeMessageAllSlots(queueId, messageId)

        break
      }
    }

    return { removed }
  }), [getDatabase()])(queueId, messageId, timestamp)
})
