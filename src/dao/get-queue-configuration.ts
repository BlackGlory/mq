import { IQueueConfig } from '@src/contract.js'
import { getDatabase } from '@src/database.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'

export const getQueueConfiguration = withLazyStatic((queueId: string): IQueueConfig | null => {
  const row = lazyStatic(() => getDatabase().prepare<
    { id: string }
  , {
      uniq: number
      drafting_timeout: number
      ordered_timeout: number
      active_timeout: number
      concurrency: number | null
      behavior_when_completed: number
      behavior_when_abandoned: number
    }
  >(`
    SELECT uniq
         , drafting_timeout
         , ordered_timeout
         , active_timeout
         , concurrency
         , behavior_when_completed
         , behavior_when_abandoned
      FROM mq_queue
     WHERE id = $id;
  `), [getDatabase()]).get({ id: queueId })

  if (!row) return null

  return {
    unique: numberToBoolean(row['uniq'])
  , draftingTimeout: row['drafting_timeout']
  , orderedTimeout: row['ordered_timeout']
  , activeTimeout: row['active_timeout']
  , concurrency: row['concurrency']
  , behaviorWhenCompleted: row['behavior_when_completed']
  , behaviorWhenAbandoned: row['behavior_when_abandoned']
  }
})

function numberToBoolean(val: number): boolean {
  return val === 0
       ? false
       : true
}
