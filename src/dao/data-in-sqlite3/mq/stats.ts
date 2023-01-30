import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const stats = withLazyStatic(function (namespace: string): IStats {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT drafting
         , waiting
         , ordered
         , active
         , completed
         , failed
      FROM mq_stats
     WHERE namespace = $namespace;
  `), [getDatabase()]).get({ namespace })

  if (row) {
    return {
      namespace
    , drafting: row['drafting']
    , waiting: row['waiting']
    , ordered: row['ordered']
    , active: row['active']
    , completed: row['completed']
    , failed: row['failed']
    }
  } else {
    return {
      namespace
    , drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 0
    , failed: 0
    }
  }
})
