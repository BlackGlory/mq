import { getDatabase } from '../database'
import { NotFound } from './error'
import {
  downcreaseDrafting
, downcreaseWaiting
, downcreaseOrdered
, downcreaseActive
, downcreaseFailed
} from './utils/stats'
import { State } from './utils/state'

/**
 * @throws {NotFound}
 */
export function abandonMessage(namespace: string, id: string): void {
  const db = getDatabase()

  db.transaction(() => {
    const row = db.prepare(`
      SELECT state
        FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `).get({ namespace, id })
    if (!row) throw new NotFound()

    const state = row['state'] as State

    db.prepare(`
      DELETE FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `).run({ namespace, id })

    switch (state) {
      case State.Drafting: downcreaseDrafting(namespace); break
      case State.Waiting: downcreaseWaiting(namespace); break
      case State.Ordered: downcreaseOrdered(namespace); break
      case State.Active: downcreaseActive(namespace); break
      case State.Failed: downcreaseFailed(namespace); break
    }
  })()
}
