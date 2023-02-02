import { getDatabase } from '../database.js'
import { BadMessageState, NotFound } from './error.js'
import { downcreaseActive, increaseCompleted } from './utils/stats.js'
import { State } from './utils/state.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export const completeMessage = withLazyStatic((namespace: string, id: string): void => {
  lazyStatic(() => getDatabase().transaction((namespace: string, id: string) => {
    const row = lazyStatic(() => getDatabase().prepare(`
      SELECT state
        FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `), [getDatabase()]).get({ namespace, id }) as { state: State } | undefined

    if (!row) throw new NotFound()
    if (row.state !== State.Active) throw new BadMessageState(State.Active)

    lazyStatic(() => getDatabase().prepare(`
      DELETE FROM mq_message
       WHERE namespace = $namespace
         AND id = $id;
    `), [getDatabase()]).run({ namespace, id })

    downcreaseActive(namespace)
    increaseCompleted(namespace)
  }), [getDatabase()])(namespace, id)
})
