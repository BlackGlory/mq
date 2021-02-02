import { getDatabase } from '../database'
import { downcreaseDrafting, downcreaseOrdered, downcreaseActive, increaseWaiting } from './utils/stats'
import { getTimestamp } from './utils/get-timestamp'

export function fallbackOutdatedDraftingMessages(queueId: string, timestamp: number): boolean {
  const db = getDatabase()

  return db.transaction(() => {
    const result = db.prepare(`
      DELETE FROM mq_message
       WHERE mq_id = $queueId
         AND state = 'drafting'
         AND state_updated_at < $timestamp;
    `).run({ queueId, timestamp })

    downcreaseDrafting(queueId, result.changes)

    return result.changes > 0
  })()
}

export function fallbackOutdatedOrderedMessages(queueId: string, timestamp: number): boolean {
  const db = getDatabase()

  return db.transaction(() => {
    const now = getTimestamp()
    const result = db.prepare(`
      UPDATE mq_message
         SET state = 'waiting'
           , state_updated_at = $now
       WHERE mq_id = $queueId
         AND state = 'ordered'
         AND state_updated_at < $timestamp;
    `).run({ queueId, timestamp, now })

    downcreaseOrdered(queueId, result.changes)
    increaseWaiting(queueId, result.changes)

    return result.changes > 0
  })()
}

export function fallbackOutdatedActiveMessages(queueId: string, timestamp: number): boolean {
  const db = getDatabase()

  return db.transaction(() => {
    const now = getTimestamp()
    const result = db.prepare(`
      UPDATE mq_message
         SET state = 'waiting'
           , state_updated_at = $now
       WHERE mq_id = $queueId
         AND state = 'active'
         AND state_updated_at < $timestamp;
    `).run({ queueId, timestamp, now })

    downcreaseActive(queueId, result.changes)
    increaseWaiting(queueId, result.changes)

    return result.changes > 0
  })()
}
