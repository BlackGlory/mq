import { getDatabase } from '@src/database.js'
import { IMessage, MessageState } from '@src/contract.js'
import { increaseOrdered, increaseActive } from './increase-queue-stats.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { fromEntries, isntNull } from 'extra-utils'

export const getMessage = withLazyStatic((
  queueId: string
, messageId: string
, timestamp: number
): {
  message: IMessage
  orderedToActive: boolean
} | null => {
  return lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  , timestamp: number
  ): {
    message: IMessage
    orderedToActive: boolean
  } | null => {
    const messageRow = lazyStatic(() => getDatabase().prepare<
      {
        queueId: string
        messageId: string
      }
    , {
        state: MessageState
        priority: number | null
      }
    >(`
      SELECT state
           , priority
        FROM mq_message
       WHERE queue_id = $queueId
         AND id = $messageId;
    `), [getDatabase()])
      .get({ queueId, messageId })
    if (!messageRow) return null
    let state = messageRow.state
    let orderedToActive = false

    const activeMessage = lazyStatic(() => getDatabase().prepare<
      {
        queueId: string
        messageId: string
        stateUpdatedAt: number
      }
    >(`
      UPDATE mq_message
         SET state = ${MessageState.Active}
           , state_updated_at = $stateUpdatedAt
       WHERE queue_id = $queueId
         AND id = $messageId;
    `), [getDatabase()])

    if (messageRow['state'] === MessageState.Ordered) {
      activeMessage.run({
        queueId
      , messageId
      , stateUpdatedAt: timestamp
      })

      increaseOrdered(queueId, -1)
      increaseActive(queueId, 1)

      state = MessageState.Active
      orderedToActive = true
    }

    const slotRows = lazyStatic(() => getDatabase().prepare<
      {
        queueId: string
        messageId: string
      }
    , {
        name: string
        value: string | null
      }
    >(`
      SELECT name
           , value
        FROM mq_message_slot
       WHERE queue_id = $queueId
         AND message_id = $messageId
    `), [getDatabase()]).all({ queueId, messageId })

    return {
      message: {
        state
      , priority: messageRow['priority']
      , slots: fromEntries(slotRows.map(row => [
          row.name
        , isntNull(row.value)
          ? JSON.parse(row.value)
          : undefined
        ]))
      }
    , orderedToActive
    }
  }), [getDatabase()])(queueId, messageId, timestamp)
})
