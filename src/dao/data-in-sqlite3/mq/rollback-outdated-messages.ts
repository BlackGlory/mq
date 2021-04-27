import { getDatabase } from '../database'
import { downcreaseDrafting, downcreaseOrdered, downcreaseActive, increaseWaiting } from './utils/stats'
import { getTimestamp } from './utils/get-timestamp'

export function rollbackOutdatedDraftingMessages(namespace: string, timestamp: number): boolean {
  const db = getDatabase()

  return db.transaction(() => {
    const result = db.prepare(`
      DELETE FROM mq_message
       WHERE namespace = $namespace
         AND state = 'drafting'
         AND state_updated_at < $timestamp;
    `).run({ namespace, timestamp })

    downcreaseDrafting(namespace, result.changes)

    return result.changes > 0
  })()
}

export function rollbackOutdatedOrderedMessages(namespace: string, timestamp: number): boolean {
  const db = getDatabase()

  return db.transaction(() => {
    const now = getTimestamp()
    const result = db.prepare(`
      UPDATE mq_message
         SET state = 'waiting'
           , state_updated_at = $now
       WHERE namespace = $namespace
         AND state = 'ordered'
         AND state_updated_at < $timestamp;
    `).run({ namespace, timestamp, now })

    downcreaseOrdered(namespace, result.changes)
    increaseWaiting(namespace, result.changes)

    return result.changes > 0
  })()
}

export function rollbackOutdatedActiveMessages(namespace: string, timestamp: number): boolean {
  const db = getDatabase()

  return db.transaction(() => {
    const now = getTimestamp()
    const result = db.prepare(`
      UPDATE mq_message
         SET state = 'waiting'
           , state_updated_at = $now
       WHERE namespace = $namespace
         AND state = 'active'
         AND state_updated_at < $timestamp;
    `).run({ namespace, timestamp, now })

    downcreaseActive(namespace, result.changes)
    increaseWaiting(namespace, result.changes)

    return result.changes > 0
  })()
}
