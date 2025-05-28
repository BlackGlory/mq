import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const removeQueueConfiguration = withLazyStatic((queueId: string): void => {
  lazyStatic(() => getDatabase().prepare<{ id: string }>(`
    DELETE FROM mq_queue
     WHERE id = $id
  `), [getDatabase()]).run({ id: queueId })
})
