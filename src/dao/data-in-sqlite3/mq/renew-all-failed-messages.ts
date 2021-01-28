import { getDatabase } from '../database'
import { downcreaseFailed, increaseWaiting } from './utils/stats'
import { getTimestamp } from './utils/get-timestamp'

export function renewAllFailedMessages(queueId: string): void {
  const timestamp = getTimestamp()
  const db = getDatabase()

  db.transaction(() => {
    const result = db.prepare(`
      UPDATE mq_message
         SET state = 'waiting'
           , state_updated_at = $stateUpdatedAt
       WHERE mq_id = $queueId
         AND state = 'failed';
    `).run({
      queueId
    , stateUpdatedAt: timestamp
    })

    downcreaseFailed(queueId, result.changes)
    increaseWaiting(queueId, result.changes)
  })()
}
