import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const clear = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      DELETE FROM mq_message
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    lazyStatic(() => getDatabase().prepare(`
      DELETE FROM mq_stats
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })
  }), [getDatabase()])(namespace)
})
