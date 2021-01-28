import { getDatabase } from '../database'
import { BadMessageState } from './error'
import { getTimestamp } from './utils/get-timestamp'
import { downcreaseFailed, increaseWaiting } from './utils/stats'

/**
 * @throws {BadMessageState}
 */
export function renewMessage(queueId: string, messageId: string): void {
  const timestamp = getTimestamp()
  const db = getDatabase()

  db.transaction(() => {
    const result = db.prepare(`
      SELECT EXISTS(
               SELECT *
                 FROM mq_message
                WHERE mq_id = $queueId
                  AND message_id = $messageId
                  AND state = 'failed'
             ) AS matched;
    `).get({ queueId, messageId })
    if (!result['matched']) throw new BadMessageState('failed')

    db.prepare(`
      UPDATE mq_message
         SET state = 'waiting'
           , state_updated_at = $stateUpdatedAt
       WHERE mq_id = $queueId
         AND message_id = $messageId;
    `).run({
      queueId
    , messageId
    , stateUpdatedAt: timestamp
    })

    downcreaseFailed(queueId)
    increaseWaiting(queueId)
  })()
}
