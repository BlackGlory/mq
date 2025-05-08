import { getDatabase } from '@src/database.js'
import { BadMessageState, NotFound } from './error.js'
import { getTimestamp } from './utils/get-timestamp.js'
import { downcreaseActive, increaseFailed } from './utils/stats.js'
import { State } from './utils/state.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export const failMessage = withLazyStatic(function (namespace: string, id: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string, id: string) => {
    const timestamp = getTimestamp()

    const row = lazyStatic(() => getDatabase().prepare(`
      SELECT state
        FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `), [getDatabase()]).get({ namespace, id }) as { state: State } | undefined

    if (!row) throw new NotFound()
    if (row.state !== State.Active) throw new BadMessageState(State.Active)

    lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_message
         SET state = 'failed'
           , state_updated_at = $stateUpdatedAt
       WHERE namespace = $namespace
         AND id = $id;
    `), [getDatabase()]).run({
      namespace
    , id
    , stateUpdatedAt: timestamp
    })

    downcreaseActive(namespace)
    increaseFailed(namespace)
  }), [getDatabase()])(namespace, id)
})
