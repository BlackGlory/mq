import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { getQueueConfiguration } from './get-queue-configuration.js'
import { MessageState, QueueNotFound } from '@src/contract.js'
import { getQueueStats } from './get-queue-stats.js'
import { increaseOrdered, increaseWaiting } from './increase-queue-stats.js'

/**
 * @throws {QueueNotFound}
 */
export const orderMessage = withLazyStatic((
  queueId: string
, timestamp: number
): string | null => {
  return lazyStatic(() => getDatabase().transaction((
    queueId: string
  , timestamp: number
  ): string | null => {
    const config = getQueueConfiguration(queueId)
    if (!config) throw new QueueNotFound()
    const concurrency = config.concurrency ?? Infinity

    const stats = getQueueStats(queueId)
    if (!stats) throw new QueueNotFound()
    if (stats.active + stats.ordered >= concurrency) return null

    const row = lazyStatic(() => getDatabase().prepare<
      { queueId: string }
    , { id: string }
    >(`
      SELECT id
        FROM mq_message
       WHERE queue_id = $queueId
         AND state = ${MessageState.Waiting}
       ORDER BY priority         DESC NULLS LAST
              , state_updated_at ASC
              , rowid            ASC
       LIMIT 1;
    `), [getDatabase()]).get({ queueId })
    if (!row) return null

    const messageId = row['id']
    lazyStatic(() => getDatabase().prepare<
      {
        queueId: string
        messageId: string
        stateUpdatedAt: number
      }
    >(`
      UPDATE mq_message
         SET state = ${MessageState.Ordered}
           , state_updated_at = $stateUpdatedAt
       WHERE queue_id = $queueId
         AND id = $messageId;
    `), [getDatabase()]).run({
      queueId
    , messageId
    , stateUpdatedAt: timestamp
    })

    increaseWaiting(queueId, -1)
    increaseOrdered(queueId, 1)

    return messageId
  }), [getDatabase()])(queueId, timestamp)
})
