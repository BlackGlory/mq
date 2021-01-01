import { getDatabase } from '../database'

export function listAllQueueIds(): string[] {
  const rows = getDatabase().prepare(`
    SELECT mq_id
      FROM mq_stats;
  `).all()

  return rows.map(x => x['mq_id'])
}
