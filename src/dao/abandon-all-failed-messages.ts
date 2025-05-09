import { getDatabase } from '@src/database.js'
import { downcreaseFailed } from './utils/stats.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const abandonAllFailedMessages = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction(() => {
    const result = lazyStatic(() => getDatabase().prepare(`
      DELETE FROM mq_message
       WHERE namespace = $namespace
         AND state = 'failed';
    `), [getDatabase()]).run({ namespace })

    downcreaseFailed(namespace, result.changes)
  }), [getDatabase()])()
})
