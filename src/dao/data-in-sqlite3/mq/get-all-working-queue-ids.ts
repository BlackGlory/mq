import { getDatabase } from '../database'
import { map } from 'iterable-operator'

export function getAllWorkingQueueIds(): Iterable<string> {
  const iter = getDatabase().prepare(`
    SELECT mq_id
      FROM mq_stats
     WHERE ordered > 0
        OR active > 0;
  `).iterate()

  return map(iter, x => x['mq_id'])
}
