import { getDatabase } from '../database'
import { map } from 'iterable-operator'

export function getAllQueueIds(): Iterable<string> {
  const iter = getDatabase().prepare(`
    SELECT mq_id
      FROM mq_stats;
  `).iterate()

  return map(iter, x => x['mq_id'])
}
