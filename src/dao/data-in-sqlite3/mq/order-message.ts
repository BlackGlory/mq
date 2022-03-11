import { getDatabase } from '../database'
import { getTimestamp } from './utils/get-timestamp'
import { downcreaseWaiting, increaseOrdered } from './utils/stats'
import { stats } from './stats'

export function orderMessage(
  namespace: string
, concurrency: number
): string | null {
  const db = getDatabase()

  return db.transaction(() => {
    const { active, ordered } = stats(namespace)
    if (active + ordered >= concurrency) return null

    return order(namespace, getTimestamp())
  })()
}

function order(namespace: string, now: number): string | null {
  const db = getDatabase()

  const row = db.prepare(`
    SELECT id
      FROM mq_message
     WHERE namespace = $namespace
       AND state = 'waiting'
     ORDER BY priority         ASC NULLS LAST
            , state_updated_at ASC
            , rowid            ASC
     LIMIT 1;
  `).get({ namespace })
  if (!row) return null

  const id = row['id'] as string
  db.prepare(`
    UPDATE mq_message
       SET state = 'ordered'
         , state_updated_at = $stateUpdatedAt
     WHERE namespace = $namespace
       AND id = $id;
  `).run({
    namespace
  , id
  , stateUpdatedAt: now
  })

  downcreaseWaiting(namespace)
  increaseOrdered(namespace)

  return id
}
