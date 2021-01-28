import { getDatabase } from '../database'
import { downcreaseFailed } from './utils/stats'

export function abandonAllFailedMessages(queueId: string): void {
  const db = getDatabase()

  db.transaction(() => {
    const result = db.prepare(`
      DELETE FROM mq_message
       WHERE mq_id = $queueId
         AND state = 'failed';
    `).run({ queueId })

    downcreaseFailed(queueId, result.changes)
  })()
}
