import { abandonAllFailedMessages as _abandonAllFailedMessages } from '@dao/abandon-all-failed-messages.js'
import { getTimestamp } from '@utils/get-timestamp.js'
import { eventHub, Event } from '@src/event-hub.js'

/**
 * @throws {QueueNotFound}
 */
export function abandonAllFailedMessages(queueId: string): null {
  const timestamp = getTimestamp()

  const changed = _abandonAllFailedMessages(queueId, timestamp)
  if (changed) {
    eventHub.emit(queueId, Event.MessageStateFailedToAbandoned)

    if (changed.removed) {
      eventHub.emit(queueId, Event.AbandonedMessageRemoved)
    }
  }

  return null
}
