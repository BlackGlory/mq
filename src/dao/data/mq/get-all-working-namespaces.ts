import { getDatabase } from '../database.js'
import { map } from 'iterable-operator'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllWorkingNamespaces = withLazyStatic((): Iterable<string> => {
  const iter = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM mq_stats
     WHERE ordered > 0
        OR active > 0;
  `), [getDatabase()]).iterate() as IterableIterator<{ namespace: string }>

  return map(iter, x => x['namespace'])
})
