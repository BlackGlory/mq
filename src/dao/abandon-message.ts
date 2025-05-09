import { getDatabase } from '@src/database.js'
import { NotFound } from '@src/contract.js'
import {
  downcreaseDrafting
, downcreaseWaiting
, downcreaseOrdered
, downcreaseActive
, downcreaseFailed
} from './utils/stats.js'
import { State } from './utils/state.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

/**
 * @throws {NotFound}
 */
export const abandonMessage = withLazyStatic((namespace: string, id: string): void => {
  lazyStatic(() => getDatabase().transaction((namespace: string, id: string) => {
    const row = lazyStatic(() => getDatabase().prepare(`
      SELECT state
        FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `), [getDatabase()]).get({ namespace, id }) as { state: State } | undefined
    if (!row) throw new NotFound()

    const state = row['state']

    lazyStatic(() => getDatabase().prepare(`
      DELETE FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `), [getDatabase()]).run({ namespace, id })

    switch (state) {
      case State.Drafting: downcreaseDrafting(namespace); break
      case State.Waiting: downcreaseWaiting(namespace); break
      case State.Ordered: downcreaseOrdered(namespace); break
      case State.Active: downcreaseActive(namespace); break
      case State.Failed: downcreaseFailed(namespace); break
    }
  }), [getDatabase()])(namespace, id)
})
