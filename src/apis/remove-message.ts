import { hasQueue } from '@dao/has-queue.js'
import { removeMessage as _removeMessage } from '@dao/remove-message.js'
import { MessageState, QueueNotFound } from '@src/contract.js'
import { getDatabase } from '@src/database.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'
import { eventHub, Event } from '@src/event-hub.js'

/**
 * @throws {QueueNotFound}
 */
export const removeMessage = withLazyStatic((queueId: string, messageId: string): null => {
  const state = lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  ): MessageState | null => {
    if (!hasQueue(queueId)) throw new QueueNotFound()

    return _removeMessage(queueId, messageId)
  }), [getDatabase()])(queueId, messageId)

  switch (state) {
    case MessageState.Drafting: {
      eventHub.emit(queueId, Event.DraftingMessageRemoved)

      break
    }
    case MessageState.Waiting: {
      eventHub.emit(queueId, Event.WaitingMessageRemoved)

      break
    }
    case MessageState.Ordered: {
      eventHub.emit(queueId, Event.OrderedMessageRemoved)

      break
    }
    case MessageState.Active: {
      eventHub.emit(queueId, Event.ActiveMessageRemoved)

      break
    }
    case MessageState.Failed: {
      eventHub.emit(queueId, Event.FailedMessageRemoved)

      break
    }
    case MessageState.Completed: {
      eventHub.emit(queueId, Event.CompletedMessageRemoved)

      break
    }
    case MessageState.Abandoned: {
      eventHub.emit(queueId, Event.AbandonedMessageRemoved)

      break
    }
  }

  return null
})
