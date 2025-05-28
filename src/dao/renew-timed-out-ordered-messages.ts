import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { increaseOrdered, increaseWaiting } from '@dao/increase-queue-stats.js'
import { MessageState } from '@src/contract.js'

/**
 * @returns 是否有消息受影响.
 */
export const renewTimedOutOrderedMessages = withLazyStatic((
  queueId: string
, timestamp: number
, timeout: number
): boolean => {
  return lazyStatic(() => getDatabase().transaction((
    queueId: string
  , timestamp: number
  , timeout: number
  ): boolean => {
    const result = lazyStatic(() => getDatabase().prepare<
      {
        queueId: string
        timeCondition: number
        stateUpdatedAt: number
      }
    >(`
      UPDATE mq_message
         SET state = ${MessageState.Waiting}
           , state_updated_at = $stateUpdatedAt
       WHERE queue_id = $queueId
         AND state = ${MessageState.Ordered}
         AND state_updated_at <= $timeCondition;
    `), [getDatabase()]).run({
      queueId
    , timeCondition: timestamp - timeout
    , stateUpdatedAt: timestamp
    })

    increaseOrdered(queueId, -result.changes)
    increaseWaiting(queueId, result.changes)

    return result.changes > 0
  }), [getDatabase()])(queueId, timestamp, timeout)
})
