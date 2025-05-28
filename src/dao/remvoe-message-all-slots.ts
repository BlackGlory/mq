import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const removeMessageAllSlots = withLazyStatic((
  queueId: string
, messageId: string
): void => {
  lazyStatic(() => getDatabase().prepare<{
    queueId: string
    messageId: string
  }>(`
    DELETE FROM mq_message_slot
     WHERE queue_id = $queueId
       AND message_id = $messageId;
  `), [getDatabase()]).run({
    queueId
  , messageId
  })
})
