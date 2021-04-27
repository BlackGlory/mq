import { getDatabase } from '../database'
import { downcreaseFailed, increaseWaiting } from './utils/stats'
import { getTimestamp } from './utils/get-timestamp'

export function renewAllFailedMessages(namespace: string): void {
  const timestamp = getTimestamp()
  const db = getDatabase()

  db.transaction(() => {
    const result = db.prepare(`
      UPDATE mq_message
         SET state = 'waiting'
           , state_updated_at = $stateUpdatedAt
       WHERE namespace = $namespace
         AND state = 'failed';
    `).run({
      namespace
    , stateUpdatedAt: timestamp
    })

    downcreaseFailed(namespace, result.changes)
    increaseWaiting(namespace, result.changes)
  })()
}
