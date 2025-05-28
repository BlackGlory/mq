import { resetQueue as _resetQueue } from '@dao/reset-queue.js'
import { eventHub, Event } from '@src/event-hub.js'

export function resetQueue(queueId: string): null {
  _resetQueue(queueId)

  eventHub.emit(queueId, Event.QueueReset)

  return null
}
