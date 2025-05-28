import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { increaseDrafting } from '@dao/increase-queue-stats.js'
import { MessageState } from '@src/contract.js'

/**
 * @returns 是否有消息受影响.
 */
export const removeTimedOutDraftingMessages = withLazyStatic((
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
      }
    >(`
      DELETE FROM mq_message
       WHERE queue_id = $queueId
         AND state = ${MessageState.Drafting}
         AND state_updated_at <= $timeCondition;
    `), [getDatabase()]).run({
      queueId
    , timeCondition: timestamp - timeout
    })

    increaseDrafting(queueId, -result.changes)

    return result.changes > 0
  }), [getDatabase()])(queueId, timestamp, timeout)
})
