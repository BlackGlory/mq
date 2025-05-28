import { completeMessage as _completeMessage } from '@dao/complete-message.js'
import { getTimestamp } from '@utils/get-timestamp.js'
import { eventHub, Event } from '@src/event-hub.js'

/**
 * @throws {QueueNotFound}
 * @throws {MessageNotFound}
 * @throws {BadMessageState}
 */
export function completeMessage(queueId: string, messageId: string): null {
  const timestamp = getTimestamp()

  const { removed } = _completeMessage(queueId, messageId, timestamp)

  eventHub.emit(queueId, Event.MessageStateActiveToCompleted)

  if (removed) {
    eventHub.emit(queueId, Event.CompletedMessageRemoved)
  }

  return null
}
