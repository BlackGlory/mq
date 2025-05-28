import { hasQueue } from '@dao/has-queue.js'
import { renewAllFailedMessages as _renewAllFailedMessages } from '@dao/renew-all-failed-messages.js'
import { QueueNotFound } from '@src/contract.js'
import { getDatabase } from '@src/database.js'
import { eventHub, Event } from '@src/event-hub.js'
import { getTimestamp } from '@utils/get-timestamp.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'

/**
 * @throws {QueueNotFound}
 */
export const renewAllFailedMessages = withLazyStatic((queueId: string): null => {
  const timestamp = getTimestamp()

  const changed = lazyStatic(() => getDatabase().transaction((
    queueId: string
  , timestamp: number
  ): boolean => {
    if (!hasQueue(queueId)) throw new QueueNotFound()

    return _renewAllFailedMessages(queueId, timestamp)
  }), [getDatabase()])(queueId, timestamp)

  if (changed) eventHub.emit(queueId, Event.MessageStateFailedToWaiting)

  return null
})
