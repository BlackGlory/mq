import { getDatabase } from '../database'
import { getTimestamp } from './utils/get-timestamp'
import { hash } from './utils/hash'
import { BadMessageState, DuplicatePayload, NotFound } from './error'
import { downcreaseDrafting, increaseWaiting } from './utils/stats'
import { State } from './utils/state'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 * @throws {DuplicatePayload}
 */
export function setMessage(
  namespace: string
, id: string
, type: string
, payload: string
, unique: boolean = false
): void {
  const timestamp = getTimestamp()
  const db = getDatabase()

  db.transaction(() => {
    const row = db.prepare(`
      SELECT state
        FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `).get({ namespace, id })
    if (!row) throw new NotFound()

    if (row.state !== State.Drafting
    &&  row.state !== State.Waiting) {
      throw new BadMessageState(State.Drafting, State.Waiting)
    }

    const oldState = row['state'] as State.Drafting | State.Waiting

    const payloadHash = hash(payload)
    if (unique && hasDuplicatePayload(namespace, id, payloadHash)) {
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
         WHERE namespace = $namespace
           AND id = $id;
      `).run({
        namespace
      , id
      , type
      , payload
      , hash: payloadHash
      , stateUpdatedAt: timestamp
      })

      downcreaseDrafting(namespace)
      increaseWaiting(namespace)
    } else {
      db.prepare(`
        UPDATE mq_message
           SET type = $type
             , payload = $payload
             , hash = $hash
         WHERE namespace = $namespace
           AND id = $id;
      `).run({
        namespace
      , id
      , type
      , payload
      , hash: payloadHash
      })
    }
  })()
}

function hasDuplicatePayload(namespace: string, id: string, hash: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM mq_message
              WHERE namespace = $namespace
                AND id != $id
                AND hash = $hash
           ) AS matched;
  `).get({ namespace, id, hash })

  return !!result['matched']
}
