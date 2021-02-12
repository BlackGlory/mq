import { getDatabase } from '../database'
import { BadMessageState, NotFound } from './error'
import { downcreaseActive, increaseCompleted } from './utils/stats'
import { State } from './utils/state'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export function completeMessage(queueId: string, messageId: string): void {
  const db = getDatabase()

  db.transaction(() => {
    const row = db.prepare(`
      SELECT state
        FROM mq_message
       WHERE mq_id = $queueId
         AND message_id = $messageId;
    `).get({ queueId, messageId })
    if (!row) throw new NotFound()
    if (row.state !== State.Active) throw new BadMessageState(State.Active)

    db.prepare(`
      DELETE FROM mq_message
       WHERE mq_id = $queueId
         AND message_id = $messageId;
    `).run({ queueId, messageId })

    downcreaseActive(queueId)
    increaseCompleted(queueId)
  })()
}
