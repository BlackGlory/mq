import { getDatabase } from '../database'
import { downcreaseFailed } from './utils/stats'
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
