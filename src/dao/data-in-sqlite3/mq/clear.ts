import { getDatabase } from '../database'

export function clear(queueId: string): void {
  const db = getDatabase()

  db.transaction(() => {
    db.prepare(`
      DELETE FROM mq_message
       WHERE mq_id = $queueId
    `).run({ queueId })

    db.prepare(`
      DELETE FROM mq_stats
       WHERE mq_id = $queueId
    `).run({ queueId })

    db.prepare(`
      DELETE FROM mq_throttle
       WHERE mq_id = $queueId;
    `).run({ queueId })
  })()
}
