import { getDatabase } from '../database.js'
import { NotFound, BadMessageState } from './error.js'
import { getTimestamp } from './utils/get-timestamp.js'
import { downcreaseOrdered, increaseActive } from './utils/stats.js'
import { State } from './utils/state.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { IMessage } from './contract.js'
import { assert, isntNull } from '@blackglory/prelude'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export const getMessage = withLazyStatic((namespace: string, id: string): IMessage => {
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
    `), [getDatabase()])
      .get({ namespace, id }) as {
        type: string | null
        payload: string | null
        state: State
        priority: number | null
      } | undefined
    if (!row) throw new NotFound()

    const state = row['state']
    switch(state) {
      case State.Drafting: {
        throw new BadMessageState(
          State.Waiting
        , State.Ordered
        , State.Active
        , State.Failed
        )
      }
      case State.Ordered: {
        makeMessageActive.run({
          namespace
        , id
        , stateUpdatedAt: timestamp
        })

        downcreaseOrdered(namespace)
        increaseActive(namespace)
        break
      }
    }

    const type = row['type']
    const payload = row['payload']
    const priority = row['priority']
    assert(isntNull(type), 'The type should not be null')
    assert(isntNull(payload), 'The payload should not be null')

    return {
      type
    , payload
    , priority
    }
  }), [getDatabase()])(namespace, id)
})
