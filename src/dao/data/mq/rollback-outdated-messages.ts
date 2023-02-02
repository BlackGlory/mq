import { getDatabase } from '../database.js'
import { downcreaseDrafting, downcreaseOrdered, downcreaseActive, increaseWaiting } from './utils/stats.js'
import { getTimestamp } from './utils/get-timestamp.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const rollbackOutdatedDraftingMessages = withLazyStatic(function (
  namespace: string
, timestamp: number
): boolean {
  return lazyStatic(() => getDatabase().transaction((
    namespace: string
  , timestamp: number
  ) => {
    const result = lazyStatic(() => getDatabase().prepare(`
      DELETE FROM mq_message
       WHERE namespace = $namespace
         AND state = 'drafting'
         AND state_updated_at < $timestamp;
    `), [getDatabase()]).run({ namespace, timestamp })

    downcreaseDrafting(namespace, result.changes)

    return result.changes > 0
  }), [getDatabase()])(namespace, timestamp)
})

export const rollbackOutdatedOrderedMessages = withLazyStatic(function (
  namespace: string
, timestamp: number
): boolean {
  return lazyStatic(() => getDatabase().transaction((
    namespace: string
  , timestamp: number
  ) => {
    const now = getTimestamp()

    const result = lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_message
         SET state = 'waiting'
           , state_updated_at = $now
       WHERE namespace = $namespace
         AND state = 'ordered'
         AND state_updated_at < $timestamp;
    `), [getDatabase()]).run({ namespace, timestamp, now })

    downcreaseOrdered(namespace, result.changes)
    increaseWaiting(namespace, result.changes)

    return result.changes > 0
  }), [getDatabase()])(namespace, timestamp)
})

export const rollbackOutdatedActiveMessages = withLazyStatic(function (
  namespace: string
, timestamp: number
): boolean {
  return lazyStatic(() => getDatabase().transaction((
    namespace: string
  , timestamp: number
  ) => {
    const now = getTimestamp()

    const result = lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_message
         SET state = 'waiting'
           , state_updated_at = $now
       WHERE namespace = $namespace
         AND state = 'active'
         AND state_updated_at < $timestamp;
    `), [getDatabase()]).run({ namespace, timestamp, now })

    downcreaseActive(namespace, result.changes)
    increaseWaiting(namespace, result.changes)

    return result.changes > 0
  }), [getDatabase()])(namespace, timestamp)
})
