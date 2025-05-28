import { getMessage as _getMessage } from '@dao/get-message.js'
import { hasQueue } from '@dao/has-queue.js'
import { IMessage, QueueNotFound } from '@src/contract.js'
import { getDatabase } from '@src/database.js'
import { getTimestamp } from '@utils/get-timestamp.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'
import { eventHub, Event } from '@src/event-hub.js'

/**
 * @throws {QueueNotFound}
 */
export const getMessage = withLazyStatic((
  queueId: string
, messageId: string
): IMessage | null => {
  const timestamp = getTimestamp()

  const result = lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  , timestamp: number
  ): {
    message: IMessage
    orderedToActive: boolean
  } | null => {
    if (!hasQueue(queueId)) throw new QueueNotFound()

    return _getMessage(queueId, messageId, timestamp)
  }), [getDatabase()])(queueId, messageId, timestamp)

  if (result) {
    if (result.orderedToActive) {
      eventHub.emit(queueId, Event.MessageStateOrderedToActive)
    }

    return result.message
  } else {
    return null
  }
})
