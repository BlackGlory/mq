import { getDatabase } from '../database.js'
import { map } from 'iterable-operator'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllQueueIds = withLazyStatic(function (): Iterable<string> {
  const iter = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM mq_stats;
  `), [getDatabase()]).iterate()

  return map(iter, x => x['namespace'])
})
