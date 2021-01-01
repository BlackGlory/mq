import { draftMessage } from './draft-message'
import { setMessage } from './set-message'
import { orderMessage } from './order-message'
import { getMessage } from './get-message'
import { completeMessage } from './complete-message'
import { abandonMessage } from './abandon-message'
import { stats } from './stats'
import { clear } from './clear'
import { getAllWorkingQueueIds } from './get-all-working-queue-ids'
import { listAllQueueIds } from './list-all-queue-ids'
import {
  fallbackOutdatedDraftingMessages
, fallbackOutdatedOrderedMessages
, fallbackOutdatedActiveMessages
} from './fallback-outdated-messages'
import { BadMessageState, NotFound } from './error'

export const MQDAO: IMQDAO = {
  draftMessage: asyncify(draftMessage)
, setMessage: asyncify(setMessage)
, orderMessage: asyncify(orderMessage)
, getMessage: asyncify(getMessage)
, completeMessage: asyncify(completeMessage)
, abandonMessage: asyncify(abandonMessage)

, clear: asyncify(clear)
, stats: asyncify(stats)

, getAllWorkingQueueIds: asyncify(getAllWorkingQueueIds)
, listAllQueueIds: asyncify(listAllQueueIds)
, fallbackOutdatedDraftingMessages: asyncify(fallbackOutdatedDraftingMessages)
, fallbackOutdatedOrderedMessages: asyncify(fallbackOutdatedOrderedMessages)
, fallbackOutdatedActiveMessages: asyncify(fallbackOutdatedActiveMessages)

, NotFound
, BadMessageState
}

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}
