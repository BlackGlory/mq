import { orderMessage as _orderMessage } from '@dao/order-message.js'
import { eventHub, Event } from '@src/event-hub.js'
import { getTimestamp } from '@utils/get-timestamp.js'
import { LinkedAbortController, raceAbortSignals } from 'extra-abort'

export async function orderMessage(queueId: string, signal?: AbortSignal): Promise<string> {
  signal?.throwIfAborted()

  while (true) {
    const timestamp = getTimestamp()
    const messageId = _orderMessage(queueId, timestamp)
    if (messageId) {
      eventHub.emit(queueId, Event.MessageStateWaitingToOrdered)

      return messageId
    }

    const controller = new LinkedAbortController(raceAbortSignals([signal]))
    try {
      const signal = controller.signal
      await Promise.race([
        eventHub.waitForQueue(queueId, Event.QueueSet, signal)
      , eventHub.waitForQueue(queueId, Event.QueueReset, signal)
      , eventHub.waitForQueue(queueId, Event.QueueRemoved, signal)
      , eventHub.waitForQueue(queueId, Event.MessageStateDraftingToWaiting, signal)
      , eventHub.waitForQueue(queueId, Event.MessageStateOrderedToWaiting, signal)
      , eventHub.waitForQueue(queueId, Event.MessageStateActiveToFailed, signal)
      , eventHub.waitForQueue(queueId, Event.MessageStateActiveToCompleted, signal)
      , eventHub.waitForQueue(queueId, Event.MessageStateActiveToWaiting, signal)
      , eventHub.waitForQueue(queueId, Event.MessageStateActiveToAbandoned, signal)
      , eventHub.waitForQueue(queueId, Event.MessageStateFailedToWaiting, signal)
      , eventHub.waitForQueue(queueId, Event.OrderedMessageRemoved, signal)
      , eventHub.waitForQueue(queueId, Event.ActiveMessageRemoved, signal)
      ])
    } finally {
      controller.abort()
    }
  }
}
