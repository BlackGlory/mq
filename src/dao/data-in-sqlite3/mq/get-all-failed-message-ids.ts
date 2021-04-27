import { getDatabase } from '../database'
import { map } from 'iterable-operator'

export function getAllFailedMessageIds(namespace: string): Iterable<string> {
  const iter = getDatabase().prepare(`
    SELECT id
      FROM mq_message
     WHERE namespace = $namespace
       AND state = 'failed'
     ORDER BY state_updated_at ASC;
  `).iterate({ namespace })

  return map(iter, x => x['id'])
}
