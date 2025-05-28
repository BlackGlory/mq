import { getDatabase } from '@src/database.js'
import { increaseAbandoned, increaseFailed } from './increase-queue-stats.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { AdditionalBehavior, MessageState, QueueNotFound } from '@src/contract.js'
import { getQueueConfiguration } from './get-queue-configuration.js'
import { removeMessage } from './remove-message.js'
import { removeMessageAllSlots } from './remvoe-message-all-slots.js'

/**
 * @throws {QueueNotFound}
 * @returns 是否有消息受影响.
 */
export const abandonAllFailedMessages = withLazyStatic((
  queueId: string
, timestamp: number
): { removed: boolean } | false => {
  return lazyStatic(() => getDatabase().transaction((
    queueId: string
  , timestamp: number
  ): { removed: boolean } | false => {
    const config = getQueueConfiguration(queueId)
    if (!config) throw new QueueNotFound()

    const rows = lazyStatic(() => getDatabase().prepare<
      {
        queueId: string
        stateUpdatedAt: number
      }
    , { id: string }
    >(`
      UPDATE mq_message
         SET state = ${MessageState.Abandoned}
           , state_updated_at = $stateUpdatedAt
       WHERE queue_id = $queueId
         AND state = ${MessageState.Failed}
      RETURNING id;
    `), [getDatabase()]).all({
      queueId
    , stateUpdatedAt: timestamp
    })

    increaseFailed(queueId, -rows.length)
    increaseAbandoned(queueId, rows.length)

    let removed = false
    switch (config.behaviorWhenAbandoned) {
      case AdditionalBehavior.RemoveMessage: {
        removed = true

        for (const row of rows) {
          removeMessage(queueId, row.id)
        }

        increaseAbandoned(queueId, rows.length)

        break
      }
      case AdditionalBehavior.RemoveAllSlots: {
        for (const row of rows) {
          removeMessageAllSlots(queueId, row.id)
        }

        break
      }
    }

    return rows.length
         ? { removed }
         : false
  }), [getDatabase()])(queueId, timestamp)
})
