import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const hasQueue = withLazyStatic((id: string): boolean => {
  const row = lazyStatic(() => getDatabase().prepare<
    { id: string }
  , { matched: 1 | 0 }
  >(`
    SELECT EXISTS(
             SELECT 1
               FROM mq_queue
              WHERE id = $id
           ) AS matched;
  `), [getDatabase()])
    .get({ id })

  return !!row!['matched']
})
