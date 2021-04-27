import { getDatabase } from '../database'
import { BadMessageState, NotFound } from './error'
import { downcreaseActive, increaseCompleted } from './utils/stats'
import { State } from './utils/state'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export function completeMessage(namespace: string, id: string): void {
  const db = getDatabase()

  db.transaction(() => {
    const row = db.prepare(`
      SELECT state
        FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `).get({ namespace, id })
    if (!row) throw new NotFound()
    if (row.state !== State.Active) throw new BadMessageState(State.Active)

    db.prepare(`
      DELETE FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `).run({ namespace, id })

    downcreaseActive(namespace)
    increaseCompleted(namespace)
  })()
}
