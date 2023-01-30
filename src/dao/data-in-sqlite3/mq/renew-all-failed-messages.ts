import { getDatabase } from '../database.js'
import { downcreaseFailed, increaseWaiting } from './utils/stats.js'
import { getTimestamp } from './utils/get-timestamp.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const renewAllFailedMessages = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    const timestamp = getTimestamp()

    const result = lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_message
         SET state = 'waiting'
           , state_updated_at = $stateUpdatedAt
       WHERE namespace = $namespace
         AND state = 'failed';
    `), [getDatabase()]).run({
      namespace
    , stateUpdatedAt: timestamp
    })

    downcreaseFailed(namespace, result.changes)
    increaseWaiting(namespace, result.changes)
  }), [getDatabase()])(namespace)
})
