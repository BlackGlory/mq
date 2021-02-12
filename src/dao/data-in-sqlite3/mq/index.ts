import { draftMessage } from './draft-message'
import { setMessage } from './set-message'
import { orderMessage } from './order-message'
import { getMessage } from './get-message'
import { abandonMessage } from './abandon-message'
import { completeMessage } from './complete-message'
import { failMessage } from './fail-message'
import { renewMessage } from './renew-message'
import { abandonAllFailedMessages } from './abandon-all-failed-messages'
import { renewAllFailedMessages } from './renew-all-failed-messages'
import { stats } from './stats'
import { clear } from './clear'
import { getAllFailedMessageIds } from './get-all-failed-message-ids'
import { getAllWorkingQueueIds } from './get-all-working-queue-ids'
import { getAllQueueIds } from './get-all-queue-ids'
import {
  fallbackOutdatedDraftingMessages
, fallbackOutdatedOrderedMessages
, fallbackOutdatedActiveMessages
} from './fallback-outdated-messages'
import { BadMessageState, NotFound, DuplicatePayload } from './error'

export const MQDAO: IMQDAO = {
  draftMessage: asyncify(draftMessage)
, setMessage: asyncify(setMessage)
, orderMessage: asyncify(orderMessage)
, getMessage: asyncify(getMessage)
, abandonMessage: asyncify(abandonMessage)
, completeMessage: asyncify(completeMessage)
, failMessage: asyncify(failMessage)
, renewMessage: asyncify(renewMessage)

, abandonAllFailedMessages: asyncify(abandonAllFailedMessages)
, renewAllFailedMessages: asyncify(renewAllFailedMessages)

, clear: asyncify(clear)
, stats: asyncify(stats)

, getAllFailedMessageIds: asyncifyIterable(getAllFailedMessageIds)
, getAllWorkingQueueIds: asyncifyIterable(getAllWorkingQueueIds)
, getAllQueueIds: asyncifyIterable(getAllQueueIds)

, fallbackOutdatedDraftingMessages: asyncify(fallbackOutdatedDraftingMessages)
, fallbackOutdatedOrderedMessages: asyncify(fallbackOutdatedOrderedMessages)
, fallbackOutdatedActiveMessages: asyncify(fallbackOutdatedActiveMessages)

, NotFound
, BadMessageState
, DuplicatePayload
}

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}

function asyncifyIterable<T extends any[], U>(fn: (...args: T) => Iterable<U>): (...args: T) => AsyncIterable<U> {
  return async function* (this: unknown, ...args: T): AsyncIterable<U> {
    yield* Reflect.apply(fn, this, args)
  }
}
