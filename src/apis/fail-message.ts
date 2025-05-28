import { failMessage as _failMessage } from '@dao/fail-message.js'
import { hasQueue } from '@dao/has-queue.js'
import { QueueNotFound } from '@src/contract.js'
import { getDatabase } from '@src/database.js'
import { getTimestamp } from '@utils/get-timestamp.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'
import { eventHub, Event } from '@src/event-hub.js'

/**
 * @throws {QueueNotFound}
 * @throws {MessageNotFound}
 * @throws {BadMessageState}
 */
export const failMessage = withLazyStatic((
  queueId: string
, messageId: string
): null => {
  const timestamp = getTimestamp()

  lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  , timestamp: number
  ) => {
    if (!hasQueue(queueId)) throw new QueueNotFound()

    _failMessage(queueId, messageId, timestamp)
  }), [getDatabase()])(queueId, messageId, timestamp)

  eventHub.emit(queueId, Event.MessageStateActiveToFailed)

  return null
})
