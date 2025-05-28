import { removeQueueConfiguration } from '@dao/remove-queue-configuration.js'
import { eventHub, Event } from '@src/event-hub.js'

export function removeQueue(queueId: string): null {
  removeQueueConfiguration(queueId)

  eventHub.emit(queueId, Event.QueueRemoved)

  return null
}
