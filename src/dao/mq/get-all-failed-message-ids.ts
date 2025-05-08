import { getDatabase } from '@src/database.js'
import { map } from 'iterable-operator'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllFailedMessageIds = withLazyStatic(function (
  namespace: string
): Iterable<string> {
  const iter = lazyStatic(() => getDatabase().prepare(`
    SELECT id
      FROM mq_message
     WHERE namespace = $namespace
       AND state = 'failed'
     ORDER BY state_updated_at ASC;
  `), [getDatabase()])
    .iterate({ namespace }) as IterableIterator<{ id: string }>

  return map(iter, x => x['id'])
})
