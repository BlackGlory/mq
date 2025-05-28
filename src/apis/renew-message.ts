import { hasQueue } from '@dao/has-queue.js'
import { renewMessage as _renewMessage } from '@dao/renew-message.js'
import { QueueNotFound } from '@src/contract.js'
import { getDatabase } from '@src/database.js'
import { eventHub, Event } from '@src/event-hub.js'
import { getTimestamp } from '@utils/get-timestamp.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'

/**
 * @throws {QueueNotFound}
 * @throws {MessageNotFound}
 * @throws {BadMessageState}
 */
export const renewMessage = withLazyStatic((queueId: string, messageId: string): null => {
  const timestamp = getTimestamp()

  lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  , timestamp: number
  ): void => {
    if (!hasQueue(queueId)) throw new QueueNotFound()

    _renewMessage(queueId, messageId, timestamp)
  }), [getDatabase()])(queueId, messageId, timestamp)

  eventHub.emit(messageId, Event.MessageStateFailedToWaiting)

  return null
})
