import { IQueueConfig } from '@src/contract.js'
import { setQueueConfiguration } from '@dao/set-queue-configuration.js'
import { eventHub, Event } from '@src/event-hub.js'

export function setQueue(queueId: string, config: IQueueConfig): null {
  setQueueConfiguration(queueId, config)

  eventHub.emit(queueId, Event.QueueSet)

  return null
}
