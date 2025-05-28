import { getDatabase } from '@src/database.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'

export const resetQueue = withLazyStatic((queueId: string) => {
  lazyStatic(() => getDatabase().transaction((queueId: string): void => {
    lazyStatic(() => getDatabase().prepare<{
      queueId: string
    }>(`
      DELETE FROM mq_message
       WHERE queue_id = $queueId
    `), [getDatabase()]).run({ queueId })

    lazyStatic(() => getDatabase().prepare<{
      queueId: string
    }>(`
      UPDATE mq_queue
         SET drafting = 0
           , waiting = 0
           , ordered = 0
           , active = 0
           , failed = 0
           , completed = 0
           , abandoned = 0
       WHERE id = $queueId
    `), [getDatabase()]).run({ queueId })
  }), [getDatabase()])(queueId)
})
