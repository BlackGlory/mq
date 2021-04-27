import { getDatabase } from '../database'
import { NotFound, BadMessageState } from './error'
import { getTimestamp } from './utils/get-timestamp'
import { downcreaseOrdered, increaseActive } from './utils/stats'
import { State } from './utils/state'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export function getMessage(namespace: string, id: string): IMessage {
  const timestamp = getTimestamp()
  const db = getDatabase()

  return db.transaction(() => {
    const row = db.prepare(`
      SELECT type
           , payload
           , state
           , priority
        FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `).get({ namespace, id })
    if (!row) throw new NotFound()

    const state = row['state'] as State
    switch(state) {
      case State.Drafting:
        throw new BadMessageState(
          State.Waiting
        , State.Ordered
        , State.Active
        , State.Failed
        )
      case State.Ordered:
        db.prepare(`
          UPDATE mq_message
             SET state = 'active'
               , state_updated_at = $stateUpdatedAt
           WHERE namespace = $namespace
             AND id = $id;
        `).run({
          namespace
        , id
        , stateUpdatedAt: timestamp
        })

        downcreaseOrdered(namespace)
        increaseActive(namespace)
        break
    }

    return {
      type: row['type']
    , payload: row['payload']
    , priority: row['priority']
    }
  })()
}
