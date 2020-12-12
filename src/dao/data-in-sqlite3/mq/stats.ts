import { getDatabase } from '../database'

export function stats(id: string): IStats {
  const row = getDatabase().prepare(`
    SELECT drafting
         , waiting
         , ordered
         , active
         , completed
      FROM mq_stats
     WHERE mq_id = $id
  `).get({ id })

  if (row) {
    return {
      drafting: row['drafting']
    , waiting: row['waiting']
    , ordered: row['ordered']
    , active: row['active']
    , completed: row['completed']
    }
  } else {
    return {
      drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 0
    }
  }
}
