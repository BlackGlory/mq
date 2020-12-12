import { getDatabase } from '../database'
import { downcreaseDrafting, downcreaseOrdered, downcreaseActive } from './utils/stats'

export function clearOutdatedDraftingMessages(queueId: string, timestamp: number): void {
  const db = getDatabase()

  db.transaction(() => {
    const result = db.prepare(`
      DELETE FROM mq_message
       WHERE mq_id = $queueId
         AND state = 'drafting'
         AND state_updated_at < $timestamp;
    `).run({ queueId, timestamp })

    downcreaseDrafting(queueId, result.changes)
  })()
}

export function clearOutdatedOrderedMessages(queueId: string, timestamp: number): void {
  const db = getDatabase()

  db.transaction(() => {
    const result = db.prepare(`
      DELETE FROM mq_message
       WHERE mq_id = $queueId
         AND state = 'ordered'
         AND state_updated_at < $timestamp;
    `).run({ queueId, timestamp })

    downcreaseOrdered(queueId, result.changes)
  })()
}

export function clearOutdatedActiveMessages(queueId: string, timestamp: number): void {
  const db = getDatabase()

  db.transaction(() => {
    const result = db.prepare(`
      DELETE FROM mq_message
       WHERE mq_id = $queueId
         AND state = 'active'
         AND state_updated_at < $timestamp;
    `).run({ queueId, timestamp })

    downcreaseActive(queueId, result.changes)
  })()
}
