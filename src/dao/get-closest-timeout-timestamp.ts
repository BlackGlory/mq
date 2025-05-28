import { getDatabase } from '@src/database.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'
import { MessageState } from '@src/contract.js'

export const getClosestTimeoutTimestamp = withLazyStatic((
  queueId: string
): number | null => {
  return lazyStatic(() => getDatabase().prepare<
    { queueId: string }
  , { timestamp: number }
  >(`
    SELECT (
             CASE state
               WHEN ${MessageState.Drafting} THEN state_updated_at + drafting_timeout
               WHEN ${MessageState.Ordered} THEN state_updated_at + ordered_timeout
               WHEN ${MessageState.Active} THEN state_updated_at + active_timeout
               ELSE NULL
             END
           ) AS timestamp
      FROM mq_message
           INNER JOIN mq_queue
              ON mq_queue.id = mq_message.queue_id
     WHERE queue_id = $queueId
       AND state IN (
             ${MessageState.Drafting},
             ${MessageState.Ordered},
             ${MessageState.Active}
           )
     ORDER BY timestamp ASC NULLS LAST
     LIMIT 1;
  `), [getDatabase()]).get({ queueId })?.timestamp ?? null
})
