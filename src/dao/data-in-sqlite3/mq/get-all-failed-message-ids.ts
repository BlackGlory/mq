import { getDatabase } from '../database'
import { map } from 'iterable-operator'

export function getAllFailedMessageIds(queueId: string): Iterable<string> {
  const iter = getDatabase().prepare(`
    SELECT message_id
      FROM mq_message
     WHERE mq_id = $mqId
       AND state = 'failed'
     ORDER BY state_updated_at ASC;
  `).iterate({ mqId: queueId })

  return map(iter, x => x['message_id'])
}
