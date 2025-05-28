import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { MessageState } from '@src/contract.js'

export const getMessageIdsByState = withLazyStatic((
  queueId: string
, state: MessageState
): string[] => {
  const rows = lazyStatic(() => getDatabase().prepare<
    {
      queueId: string
      state: MessageState
    }
  , { id: string }
  >(`
    SELECT id
      FROM mq_message
     WHERE queue_id = $queueId
       AND state = ${state}
     ORDER BY state_updated_at ASC;
  `), [getDatabase()])
    .all({ queueId, state })

  return rows.map(row => row['id'])
})
