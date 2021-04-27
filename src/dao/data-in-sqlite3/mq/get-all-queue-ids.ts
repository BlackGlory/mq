import { getDatabase } from '../database'
import { map } from 'iterable-operator'

export function getAllQueueIds(): Iterable<string> {
  const iter = getDatabase().prepare(`
    SELECT namespace
      FROM mq_stats;
  `).iterate()

  return map(iter, x => x['namespace'])
}
