import { assert } from '@blackglory/prelude'
import { IQueueConfig } from '@src/contract.js'
import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const setQueueConfiguration = withLazyStatic((
  queueId: string
, config: IQueueConfig
): void => {
  assert(config.draftingTimeout > 0, 'The draftingTimeout must be greater than zero.')
  assert(config.orderedTimeout > 0, 'The orderedTimeout must be greater than zero.')
  assert(config.activeTimeout > 0, 'The activeTimeout must be greater than zero.')

  lazyStatic(() => getDatabase().prepare<{
    queueId: string
    unique: number
    draftingTimeout: number
    orderedTimeout: number
    activeTimeout: number
    concurrency: number | null
    behaviorWhenCompleted: number
    behaviorWhenAbandoned: number
  }>(`
    INSERT INTO mq_queue (
                           id
                         , uniq
                         , drafting_timeout
                         , ordered_timeout
                         , active_timeout
                         , concurrency
                         , behavior_when_completed
                         , behavior_when_abandoned
                         )
    VALUES (
             $queueId
           , $unique
           , $draftingTimeout
           , $orderedTimeout
           , $activeTimeout
           , $concurrency
           , $behaviorWhenCompleted
           , $behaviorWhenAbandoned
           )
        ON CONFLICT(id)
        DO UPDATE SET uniq = $unique
                    , drafting_timeout = $draftingTimeout
                    , ordered_timeout = $orderedTimeout
                    , active_timeout = $activeTimeout
                    , concurrency = $concurrency
                    , behavior_when_completed = $behaviorWhenCompleted
                    , behavior_when_abandoned = $behaviorWhenAbandoned;
  `), [getDatabase()]).run({
    queueId
  , unique: booleanToNumber(config.unique)
  , draftingTimeout: config.draftingTimeout
  , orderedTimeout: config.orderedTimeout
  , activeTimeout: config.activeTimeout
  , concurrency: config.concurrency
  , behaviorWhenCompleted: config.behaviorWhenCompleted
  , behaviorWhenAbandoned: config.behaviorWhenAbandoned
  })
})

function booleanToNumber(val: boolean): number {
  return val
       ? 1
       : 0
}
