import { getDatabase } from '../database'
import { getTimestamp } from './utils/get-timestamp'
import { hash } from './utils/hash'
import { BadMessageState, DuplicatePayload } from './error'
import { downcreaseDrafting, increaseWaiting } from './utils/stats'
import { State } from './utils/state'

/**
 * @throws {BadMessageState}
 */
export function setMessage(queueId: string, messageId: string, type: string, payload: string, unique: boolean = false): void {
  const timestamp = getTimestamp()
  const db = getDatabase()

  db.transaction(() => {
    const row = db.prepare(`
      SELECT state
        FROM mq_message
       WHERE mq_id = $queueId
         AND message_id = $messageId
         AND state IN ('drafting', 'waiting')
    `).get({ queueId, messageId })
    if (!row) throw new BadMessageState('drafting', 'waiting')
    const oldState = row['state'] as State.Drafting | State.Waiting

    const payloadHash = hash(payload)
    if (unique && hasDuplicatePayload(queueId, messageId, payloadHash)) {
      throw new DuplicatePayload()
    }

    if (oldState === State.Drafting) {
      db.prepare(`
        UPDATE mq_message
           SET type = $type
             , payload = $payload
             , hash = $hash
             , state = 'waiting'
             , state_updated_at = $stateUpdatedAt
         WHERE mq_id = $queueId
           AND message_id = $messageId;
      `).run({
        queueId
      , messageId
      , type
      , payload
      , hash: payloadHash
      , stateUpdatedAt: timestamp
      })

      downcreaseDrafting(queueId)
      increaseWaiting(queueId)
    } else {
      db.prepare(`
        UPDATE mq_message
           SET type = $type
             , payload = $payload
             , hash = $hash
         WHERE mq_id = $queueId
           AND message_id = $messageId;
      `).run({
        queueId
      , messageId
      , type
      , payload
      , hash: payloadHash
      })
    }
  })()
}

function hasDuplicatePayload(queueId: string, messageId: string, hash: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_message
              WHERE mq_id = $queueId
                AND message_id != $messageId
                AND hash = $hash
           ) AS matched;
  `).get({ queueId, messageId, hash })
  return !!result['matched']
}
