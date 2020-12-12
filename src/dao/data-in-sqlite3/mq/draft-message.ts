import { getDatabase } from '../database'
import { getTimestamp } from './utils/get-timestamp'
import { increaseDrafting } from './utils/stats'

export function draftMessage(queueId: string, messageId: string, priority?: number): void {
  const timestamp = getTimestamp()
  const db = getDatabase()

  db.transaction(() => {
    db.prepare(`
      INSERT INTO mq_message (mq_id, message_id, priority, state, state_updated_at)
      VALUES ($mqId, $messageId, $priority, 'drafting', $stateUpdatedAt);
    `).run({
      mqId: queueId
    , messageId
    , priority: priority === undefined ? null : priority
    , stateUpdatedAt: timestamp
    })

    increaseDrafting(queueId)
  })()
}
