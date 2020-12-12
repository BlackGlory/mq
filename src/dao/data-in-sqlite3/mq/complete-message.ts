import { getDatabase } from '../database'
import { BadMessageState } from './error'
import { downcreaseActive, increaseCompleted } from './utils/stats'

export function completeMessage(queueId: string, messageId: string): void {
  const db = getDatabase()

  db.transaction(() => {
    const result = db.prepare(`
      SELECT EXISTS(
               SELECT *
                 FROM mq_message
                WHERE mq_id = $queueId
                  AND message_id = $messageId
             ) AS matched;
    `).get({ queueId, messageId })
    if (!result['matched']) throw new BadMessageState('active')

    db.prepare(`
      DELETE FROM mq_message
       WHERE mq_id = $queueId
         AND message_id = $messageId;
    `).run({ queueId, messageId })

    downcreaseActive(queueId)
    increaseCompleted(queueId)
  })()
}
