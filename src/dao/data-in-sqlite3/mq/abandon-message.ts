import { getDatabase } from '../database'
import { BadMessageState } from './error'
import {
  downcreaseDrafting
, downcreaseWaiting
, downcreaseOrdered
, downcreaseActive
} from './utils/stats'
import { State } from './utils/state'

/**
 * @throws {BadMessageState}
 */
export function abandonMessage(queueId: string, messageId: string): void {
  const db = getDatabase()

  db.transaction(() => {
    const row = db.prepare(`
      SELECT state
        FROM mq_message
       WHERE mq_id = $queueId
         AND message_id = $messageId;
    `).get({ queueId, messageId })
    if (!row) throw new BadMessageState('drafting', 'waiting', 'ordered', 'active')
    const state = row['state'] as State

    db.prepare(`
      DELETE FROM mq_message
       WHERE mq_id = $queueId
         AND message_id = $messageId;
    `).run({ queueId, messageId })

    switch (state) {
      case State.Drafting: downcreaseDrafting(queueId); break
      case State.Waiting: downcreaseWaiting(queueId); break
      case State.Ordered: downcreaseOrdered(queueId); break
      case State.Active: downcreaseActive(queueId); break
    }
  })()
}
