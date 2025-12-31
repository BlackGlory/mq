import { assert, isntEmptyArray, isString, NonEmptyArray } from '@blackglory/prelude'
import { nanoid } from 'nanoid'
import { draftMessage as __draftMessage } from '@dao/draft-message.js'
import { getTimestamp } from '@utils/get-timestamp.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'
import { getDatabase } from '@src/database.js'
import { hasQueue } from '@dao/has-queue.js'
import { DuplicateMessageId, QueueNotFound } from '@src/contract.js'
import { eventHub, Event } from '@src/event-hub.js'
import { hasMessage } from '@dao/has-message.js'

/**
 * @throws {QueueNotFound}
 */
export const draftMessage = withLazyStatic(_draftMessage)

function _draftMessage(
  queueId: string
, priority: number | null
, slotNames: NonEmptyArray<string>
, messageId: string
, signal?: AbortSignal
): string
function _draftMessage(
  queueId: string
, priority: number | null
, slotNames: NonEmptyArray<string>
, signal?: AbortSignal
): string
function _draftMessage(...args :
| [
    queueId: string
  , priority: number | null
  , slotNames: NonEmptyArray<string>
  , messageId: string
  , signal?: AbortSignal
  ]
| [
    queueId: string
  , priority: number | null
  , slotNames: NonEmptyArray<string>
  , signal?: AbortSignal
  ]
): string {
  const [queueId, priority, slotNames, messageIdOrSignal] = args
  assert(isntEmptyArray(slotNames), 'The slotNames cannot be empty.')

  const messageId = isString(messageIdOrSignal)
                  ? messageIdOrSignal
                  : nanoid()

  const timestamp = getTimestamp()

  lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  , priority: number | null
  , slotNames: NonEmptyArray<string>
  , timestamp: number
  ) => {
    if (!hasQueue(queueId)) throw new QueueNotFound()
    if (hasMessage(queueId, messageId)) throw new DuplicateMessageId()

    __draftMessage(queueId, messageId, priority, slotNames, timestamp)
  }), [getDatabase()])(queueId, messageId, priority, slotNames, timestamp)

  eventHub.emit(queueId, Event.DraftingMessageAdded)

  return messageId
}
