import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const hasMessage = withLazyStatic((queueId: string, messageId: string): boolean => {
  const row = lazyStatic(() => getDatabase().prepare<
    {
      queueId: string
      messageId: string
    }
  , { matched: 1 | 0 }
  >(`
    SELECT EXISTS(
             SELECT 1
               FROM mq_message
              WHERE queue_id = $queueId
                AND id = $messageId
           ) AS matched;
  `), [getDatabase()])
    .get({ queueId, messageId })

  return !!row!['matched']
})
