import { getDatabase } from '../database'

export function getAllWorkingQueueIds(): string[] {
  const rows = getDatabase().prepare(`
    SELECT mq_id
      FROM mq_stats
     WHERE ordered > 0
        OR active > 0;
  `).all()
  return rows.map(x => x['mq_id'])
}
