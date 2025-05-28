import { MessageState } from '@src/contract.js'
import { getDatabase } from '@src/database.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'

export const getMessageState = withLazyStatic((
  queueId: string
, messageId: string
): MessageState | null => {
  const row = lazyStatic(() => getDatabase().prepare<
    {
      queueId: string
      messageId: string
    }
  , {
      state: MessageState
      hash: string | null
    }
  >(`
    SELECT state
         , hash
      FROM mq_message
     WHERE queue_id = $queueId
       AND id = $messageId
  `), [getDatabase()]).get({ queueId, messageId })
  if (!row) return null

  return row['state']
})
