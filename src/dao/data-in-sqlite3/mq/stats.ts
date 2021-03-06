import { getDatabase } from '../database'

export function stats(namespace: string): IStats {
  const row = getDatabase().prepare(`
    SELECT drafting
         , waiting
         , ordered
         , active
         , completed
         , failed
      FROM mq_stats
     WHERE namespace = $namespace;
  `).get({ namespace })

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
}
