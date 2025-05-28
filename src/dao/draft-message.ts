import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { NonEmptyArray } from '@blackglory/prelude'
import { increaseDrafting } from './increase-queue-stats.js'
import { MessageState } from '@src/contract.js'
import { uniq } from 'iterable-operator'

export const draftMessage = withLazyStatic((
  queueId: string
, messageId: string
, priority: number | null
, slotNames: NonEmptyArray<string>
, timestamp: number
): void => {
  lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  , priority: number | null
  , slotNames: NonEmptyArray<string>
  , timestamp: number
  ) => {
    const createMessageStatement = lazyStatic(() => getDatabase().prepare<{
      queueId: string
      messageId: string
      priority: number | null
      stateUpdatedAt: number
    }>(`
      INSERT INTO mq_message (
        queue_id
      , id
      , priority
      , state
      , state_updated_at
      )
      VALUES (
        $queueId
      , $messageId
      , $priority
      , ${MessageState.Drafting}
      , $stateUpdatedAt
      );
    `), [getDatabase()])
    
    const createMessageSlotStatement = lazyStatic(() => getDatabase().prepare<{
      queueId: string
      messageId: string
      name: string
    }>(`
      INSERT INTO mq_message_slot (queue_id, message_id, name)
      VALUES ($queueId, $messageId, $name)
    `), [getDatabase()])

    createMessageStatement.run({
      queueId
    , messageId
    , priority
    , stateUpdatedAt: timestamp
    })

    increaseDrafting(queueId, 1)

    for (const slotName of uniq(slotNames)) {
      createMessageSlotStatement.run({
        queueId
      , messageId
      , name: slotName
      })
    }
  }), [getDatabase()])(queueId, messageId, priority, slotNames, timestamp)
})
