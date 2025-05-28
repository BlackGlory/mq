import { Emitter } from '@blackglory/structures'
import { waitForEmitter } from '@blackglory/wait-for'

export enum Event {
  QueueSet
, QueueReset
, QueueRemoved
, DraftingMessageAdded
, MessageStateDraftingToWaiting
, MessageStateDraftingToAbandoned
, MessageStateWaitingToOrdered
, MessageStateWaitingToAbandoned
, MessageStateOrderedToActive
, MessageStateOrderedToWaiting
, MessageStateOrderedToAbandoned
, MessageStateActiveToFailed
, MessageStateActiveToCompleted
, MessageStateActiveToWaiting
, MessageStateActiveToAbandoned
, MessageStateFailedToWaiting
, MessageStateFailedToAbandoned
, MessageStateCompletedToAbandoned
, DraftingMessageRemoved
, WaitingMessageRemoved
, OrderedMessageRemoved
, ActiveMessageRemoved
, FailedMessageRemoved
, CompletedMessageRemoved
, AbandonedMessageRemoved
}

type EventToArgs = {
  [Event.QueueSet]: []
  [Event.QueueReset]: []
  [Event.QueueRemoved]: []
  [Event.DraftingMessageAdded]: []
  [Event.MessageStateDraftingToWaiting]: []
  [Event.MessageStateDraftingToAbandoned]: []
  [Event.MessageStateWaitingToOrdered]: []
  [Event.MessageStateWaitingToAbandoned]: []
  [Event.MessageStateOrderedToActive]: []
  [Event.MessageStateOrderedToWaiting]: []
  [Event.MessageStateOrderedToAbandoned]: []
  [Event.MessageStateActiveToFailed]: []
  [Event.MessageStateActiveToCompleted]: []
  [Event.MessageStateActiveToWaiting]: []
  [Event.MessageStateActiveToAbandoned]: []
  [Event.MessageStateFailedToWaiting]: []
  [Event.MessageStateFailedToAbandoned]: []
  [Event.MessageStateCompletedToAbandoned]: []
  [Event.DraftingMessageRemoved]: []
  [Event.WaitingMessageRemoved]: []
  [Event.OrderedMessageRemoved]: []
  [Event.ActiveMessageRemoved]: []
  [Event.FailedMessageRemoved]: []
  [Event.CompletedMessageRemoved]: []
  [Event.AbandonedMessageRemoved]: []
}

type GlobalEventToArgs = {
  [Key in Event]: [queueId: string, ...args: EventToArgs[Key]]
}

class EventHub {
  private queueIdToEmitter: Map<string, Emitter<EventToArgs>> = new Map()
  private globalEmitter: Emitter<GlobalEventToArgs> = new Emitter()

  onQueue<T extends Event>(
    queueId: string
  , event: T
  , listener: (...args: EventToArgs[T]) => void
  ): () => void {
    if (!this.queueIdToEmitter.has(queueId)) {
      this.queueIdToEmitter.set(queueId, new Emitter())
    }

    const emitter = this.queueIdToEmitter.get(queueId)!
    return emitter.on(event, listener)
  }

  onceQueue<T extends Event>(
    queueId: string
  , event: T
  , listener: (...args: EventToArgs[T]) => void
  ): () => void {
    if (!this.queueIdToEmitter.has(queueId)) {
      this.queueIdToEmitter.set(queueId, new Emitter())
    }

    const emitter = this.queueIdToEmitter.get(queueId)!
    return emitter.once(event, listener)
  }

  onGlobal<T extends Event>(
    event: T
  , listener: (...args: GlobalEventToArgs[T]) => void
  ): () => void {
    return this.globalEmitter.on(event, listener)
  }

  emit<T extends Event>(
    queueId: string
  , event: T
  , ...args: EventToArgs[T]
  ): void {
    this.queueIdToEmitter.get(queueId)?.emit(event, ...args)

    const globalArgs = [queueId, ...args] as GlobalEventToArgs[T]
    this.globalEmitter.emit(event, ...globalArgs)
  }

  async waitForQueue(
    queueId: string
  , event: keyof EventToArgs
  , abortSignal?: AbortSignal
  ): Promise<void> {
    if (!this.queueIdToEmitter.has(queueId)) {
      this.queueIdToEmitter.set(queueId, new Emitter())
    }

    const emitter = this.queueIdToEmitter.get(queueId)!
    await waitForEmitter(emitter, event, abortSignal)
  }
}

export const eventHub = new EventHub()
