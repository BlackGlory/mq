import { getDatabase } from '@src/database.js'
import { increaseFailed, increaseWaiting } from './increase-queue-stats.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { MessageState } from '@src/contract.js'

/**
 * @returns 是否有被renew的消息.
 */
export const renewAllFailedMessages = withLazyStatic((
  queueId: string
, timestamp: number
): boolean => {
  return lazyStatic(() => getDatabase().transaction((
    queueId: string
  , timestamp: number
  ): boolean => {
    const { changes } = lazyStatic(() => getDatabase().prepare<{
      queueId: string
      stateUpdatedAt: number
    }>(`
      UPDATE mq_message
         SET state = ${MessageState.Waiting}
           , state_updated_at = $stateUpdatedAt
       WHERE queue_id = $queueId
         AND state = ${MessageState.Failed};
    `), [getDatabase()]).run({
      queueId
    , stateUpdatedAt: timestamp
    })

    increaseFailed(queueId, -changes)
    increaseWaiting(queueId, changes)

    return changes > 0
  }), [getDatabase()])(queueId, timestamp)
})
