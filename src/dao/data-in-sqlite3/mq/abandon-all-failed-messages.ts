import { getDatabase } from '../database'
import { downcreaseFailed } from './utils/stats'

export function abandonAllFailedMessages(namespace: string): void {
  const db = getDatabase()

  db.transaction(() => {
    const result = db.prepare(`
      DELETE FROM mq_message
       WHERE namespace = $namespace
         AND state = 'failed';
    `).run({ namespace })

    downcreaseFailed(namespace, result.changes)
  })()
}
