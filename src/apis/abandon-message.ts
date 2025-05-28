import { abandonMessage as _abandonMessage } from '@dao/abandon-message.js'
import { getTimestamp } from '@utils/get-timestamp.js'
import { eventHub, Event } from '@src/event-hub.js'
import { MessageState } from '@src/contract.js'

/**
 * @throws {QueueNotFound}
 * @throws {MessageNotFound}
 */
export function abandonMessage(queueId: string, messageId: string): null {
  const timestamp = getTimestamp()

  const { state, removed } = _abandonMessage(queueId, messageId, timestamp)

  switch (state) {
    case MessageState.Ordered: {
      eventHub.emit(queueId, Event.MessageStateOrderedToAbandoned)

      break
    }
    case MessageState.Active: {
      eventHub.emit(queueId, Event.MessageStateActiveToAbandoned)

      break
    }
  }

  if (removed) {
    eventHub.emit(queueId, Event.AbandonedMessageRemoved)
  }

  return null
}
