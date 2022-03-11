import { getDatabase } from '../database'

export function clear(namespace: string): void {
  const db = getDatabase()

  db.transaction(() => {
    db.prepare(`
      DELETE FROM mq_message
       WHERE namespace = $namespace;
    `).run({ namespace })

    db.prepare(`
      DELETE FROM mq_stats
       WHERE namespace = $namespace;
    `).run({ namespace })
  })()
}
