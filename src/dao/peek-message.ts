import { getDatabase } from '@src/database.js'
import { IMessage, MessageState } from '@src/contract.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { fromEntries, isntNull } from 'extra-utils'

export const peekMessage = withLazyStatic((
  queueId: string
, messageId: string
): IMessage | null => {
  return lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  ): IMessage | null => {
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
    const { state, priority } = messageRow

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
      state
    , priority
    , slots: fromEntries(slotRows.map(row => [
        row.name
      , isntNull(row.value)
        ? JSON.parse(row.value)
        : undefined
      ]))
    }
  }), [getDatabase()])(queueId, messageId)
})
