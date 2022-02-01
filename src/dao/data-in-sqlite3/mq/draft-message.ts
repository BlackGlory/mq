import { getDatabase } from '../database'
import { getTimestamp } from './utils/get-timestamp'
import { increaseDrafting } from './utils/stats'
import { isUndefined } from '@blackglory/types'

export function draftMessage(namespace: string, id: string, priority?: number): void {
  const timestamp = getTimestamp()
  const db = getDatabase()

  db.transaction(() => {
    db.prepare(`
      INSERT INTO mq_message (namespace, id, priority, state, state_updated_at)
      VALUES ($namespace, $id, $priority, 'drafting', $stateUpdatedAt);
    `).run({
      namespace
    , id
    , priority: isUndefined(priority) ? null : priority
    , stateUpdatedAt: timestamp
    })

    increaseDrafting(namespace)
  })()
}
