import { getDatabase } from '../database'
import { BadMessageState, NotFound } from './error'
import { getTimestamp } from './utils/get-timestamp'
import { downcreaseFailed, increaseWaiting } from './utils/stats'
import { State } from './utils/state'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export function renewMessage(namespace: string, id: string): void {
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
    if (row.state !== State.Failed) throw new BadMessageState(State.Failed)

    db.prepare(`
      UPDATE mq_message
         SET state = 'waiting'
           , state_updated_at = $stateUpdatedAt
       WHERE namespace = $namespace
         AND id = $id;
    `).run({
      namespace
    , id
    , stateUpdatedAt: timestamp
    })

    downcreaseFailed(namespace)
    increaseWaiting(namespace)
  })()
}
