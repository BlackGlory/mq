import { getDatabase } from '../database'
import { NotFound, BadMessageState } from './error'
import { getTimestamp } from './utils/get-timestamp'
import { downcreaseOrdered, increaseActive } from './utils/stats'
import { State } from './utils/state'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export const getMessage = withLazyStatic(function (namespace: string, id: string): IMessage {
  return lazyStatic(() => getDatabase().transaction((namespace: string, id: string) => {
    const timestamp = getTimestamp()
    const makeMessageActive = lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_message
          SET state = 'active'
            , state_updated_at = $stateUpdatedAt
        WHERE namespace = $namespace
          AND id = $id;
    `), [getDatabase()])

    const row = lazyStatic(() => getDatabase().prepare(`
      SELECT type
           , payload
           , state
           , priority
        FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `), [getDatabase()]).get({ namespace, id })
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
        makeMessageActive.run({
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
  }), [getDatabase()])(namespace, id)
})
