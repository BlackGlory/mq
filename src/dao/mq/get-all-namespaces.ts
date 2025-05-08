import { getDatabase } from '@src/database.js'
import { map } from 'iterable-operator'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllNamespaces = withLazyStatic(function (): Iterable<string> {
  const iter = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM mq_stats;
  `), [getDatabase()]).iterate() as IterableIterator<{ namespace: string }>

  return map(iter, x => x['namespace'])
})
