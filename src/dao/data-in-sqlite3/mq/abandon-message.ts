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
import { withLazyStatic, lazyStatic } from 'extra-lazy'

/**
 * @throws {NotFound}
 */
export const abandonMessage = withLazyStatic(function (namespace: string, id: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string, id: string) => {
    const row = lazyStatic(() => getDatabase().prepare(`
      SELECT state
        FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `), [getDatabase()]).get({ namespace, id })
    if (!row) throw new NotFound()

    const state = row['state'] as State

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
