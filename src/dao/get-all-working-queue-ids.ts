import { getDatabase } from '@src/database.js'
import { map } from 'iterable-operator'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllWorkingQueueIds = withLazyStatic((): Iterable<string> => {
  const iter = lazyStatic(() => getDatabase().prepare<[], { id: string }>(`
    SELECT id
      FROM mq_queue
     WHERE drafting > 0
        OR ordered > 0
        OR active > 0;
  `), [getDatabase()])
    .iterate()

  return map(iter, x => x['id'])
})
