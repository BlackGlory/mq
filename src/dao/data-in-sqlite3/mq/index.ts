import { draftMessage } from './draft-message.js'
import { setMessage } from './set-message.js'
import { orderMessage } from './order-message.js'
import { getMessage } from './get-message.js'
import { abandonMessage } from './abandon-message.js'
import { completeMessage } from './complete-message.js'
import { failMessage } from './fail-message.js'
import { renewMessage } from './renew-message.js'
import { abandonAllFailedMessages } from './abandon-all-failed-messages.js'
import { renewAllFailedMessages } from './renew-all-failed-messages.js'
import { stats } from './stats.js'
import { clear } from './clear.js'
import { getAllFailedMessageIds } from './get-all-failed-message-ids.js'
import { getAllWorkingNamespaces } from './get-all-working-namespaces.js'
import { getAllQueueIds } from './get-all-queue-ids.js'
import {
  rollbackOutdatedDraftingMessages
, rollbackOutdatedOrderedMessages
, rollbackOutdatedActiveMessages
} from './rollback-outdated-messages.js'
import { BadMessageState, NotFound, DuplicatePayload } from './error.js'

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
, getAllWorkingNamespaces: asyncifyIterable(getAllWorkingNamespaces)
, getAllNamespaces: asyncifyIterable(getAllQueueIds)

, rollbackOutdatedDraftingMessages: asyncify(rollbackOutdatedDraftingMessages)
, rollbackOutdatedOrderedMessages: asyncify(rollbackOutdatedOrderedMessages)
, rollbackOutdatedActiveMessages: asyncify(rollbackOutdatedActiveMessages)

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
