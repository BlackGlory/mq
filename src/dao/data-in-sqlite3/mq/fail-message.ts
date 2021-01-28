import { getDatabase } from '../database'
import { BadMessageState } from './error'
import { getTimestamp } from './utils/get-timestamp'
import { downcreaseActive, increaseFailed } from './utils/stats'

/**
 * @throws {BadMessageState}
 */
export function failMessage(queueId: string, messageId: string): void {
  const timestamp = getTimestamp()
  const db = getDatabase()

  db.transaction(() => {
    const result = db.prepare(`
      SELECT EXISTS(
               SELECT *
                 FROM mq_message
                WHERE mq_id = $queueId
                  AND message_id = $messageId
                  AND state = 'active'
             ) AS matched;
    `).get({ queueId, messageId })
    if (!result['matched']) throw new BadMessageState('active')

    db.prepare(`
      UPDATE mq_message
         SET state = 'failed'
           , state_updated_at = $stateUpdatedAt
       WHERE mq_id = $queueId
         AND message_id = $messageId;
    `).run({
      queueId
    , messageId
    , stateUpdatedAt: timestamp
    })

    downcreaseActive(queueId)
    increaseFailed(queueId)
  })()
}
