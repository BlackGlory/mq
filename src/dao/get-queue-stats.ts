import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { IQueueStats } from '@src/contract.js'

export const getQueueStats = withLazyStatic((queueId: string): IQueueStats | null => {
  const row = lazyStatic(() => getDatabase().prepare<
    { id: string }
  , {
      drafting: number
      waiting: number
      ordered: number
      active: number
      failed: number
      completed: number
      abandoned: number
    }
  >(`
    SELECT drafting
         , waiting
         , ordered
         , active
         , failed
         , completed
         , abandoned
      FROM mq_queue
     WHERE id = $id;
  `), [getDatabase()]).get({ id: queueId })

  if (!row) return null

  return {
    drafting: row['drafting']
  , waiting: row['waiting']
  , ordered: row['ordered']
  , active: row['active']
  , failed: row['failed']
  , completed: row['completed']
  , abandoned: row['abandoned']
  }
})
