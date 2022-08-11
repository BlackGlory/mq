import { getDatabase } from '../database'
import { getTimestamp } from './utils/get-timestamp'
import { increaseDrafting } from './utils/stats'
import { isUndefined } from '@blackglory/types'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const draftMessage = withLazyStatic(function (
  namespace: string
, id: string
, priority?: number
): void {
  lazyStatic(() => getDatabase().transaction((
    namespace: string
  , id: string
  , priority?: number
  ) => {
    const timestamp = getTimestamp()

    lazyStatic(() => getDatabase().prepare(`
      INSERT INTO mq_message (namespace, id, priority, state, state_updated_at)
      VALUES ($namespace, $id, $priority, 'drafting', $stateUpdatedAt);
    `), [getDatabase()]).run({
      namespace
    , id
    , priority: isUndefined(priority) ? null : priority
    , stateUpdatedAt: timestamp
    })

    increaseDrafting(namespace)
  }), [getDatabase()])(namespace, id, priority)
})
