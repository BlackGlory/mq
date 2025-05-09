import { getDatabase } from '@src/database.js'
import { BadMessageState, NotFound } from '@src/contract.js'
import { getTimestamp } from './utils/get-timestamp.js'
import { downcreaseFailed, increaseWaiting } from './utils/stats.js'
import { State } from './utils/state.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export const renewMessage = withLazyStatic(function (namespace: string, id: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    const timestamp = getTimestamp()

    const row = lazyStatic(() => getDatabase().prepare(`
      SELECT state
        FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `), [getDatabase()]).get({ namespace, id }) as { state: State } | undefined
    if (!row) throw new NotFound()
    if (row.state !== State.Failed) throw new BadMessageState(State.Failed)

    lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_message
         SET state = 'waiting'
           , state_updated_at = $stateUpdatedAt
       WHERE namespace = $namespace
         AND id = $id;
    `), [getDatabase()]).run({
      namespace
    , id
    , stateUpdatedAt: timestamp
    })

    downcreaseFailed(namespace)
    increaseWaiting(namespace)
  }), [getDatabase()])(namespace)
})
