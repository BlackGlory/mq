import { getDatabase } from '../database.js'
import { getTimestamp } from './utils/get-timestamp.js'
import { downcreaseWaiting, increaseOrdered } from './utils/stats.js'
import { stats } from './stats.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const orderMessage = withLazyStatic(function (
  namespace: string
, concurrency: number
): string | null {
  return lazyStatic(() => getDatabase().transaction((namespace: string) => {
    const { active, ordered } = stats(namespace)
    if (active + ordered >= concurrency) return null

    return order(namespace, getTimestamp())
  }), [getDatabase()])(namespace)
})

const order = withLazyStatic(function (namespace: string, now: number): string | null {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT id
      FROM mq_message
     WHERE namespace = $namespace
       AND state = 'waiting'
     ORDER BY priority         ASC NULLS LAST
            , state_updated_at ASC
            , rowid            ASC
     LIMIT 1;
  `), [getDatabase()]).get({ namespace }) as { id: string } | undefined
  if (!row) return null

  const id = row['id']
  lazyStatic(() => getDatabase().prepare(`
    UPDATE mq_message
       SET state = 'ordered'
         , state_updated_at = $stateUpdatedAt
     WHERE namespace = $namespace
       AND id = $id;
  `), [getDatabase()]).run({
    namespace
  , id
  , stateUpdatedAt: now
  })

  downcreaseWaiting(namespace)
  increaseOrdered(namespace)

  return id
})
