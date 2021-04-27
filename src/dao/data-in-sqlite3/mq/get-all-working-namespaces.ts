import { getDatabase } from '../database'
import { map } from 'iterable-operator'

export function getAllWorkingNamespaces(): Iterable<string> {
  const iter = getDatabase().prepare(`
    SELECT namespace
      FROM mq_stats
     WHERE ordered > 0
        OR active > 0;
  `).iterate()

  return map(iter, x => x['namespace'])
}
