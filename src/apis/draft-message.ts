import { assert, isntEmptyArray, NonEmptyArray } from '@blackglory/prelude'
import { nanoid } from 'nanoid'
import { draftMessage as _draftMessage } from '@dao/draft-message.js'
import { getTimestamp } from '@utils/get-timestamp.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'
import { getDatabase } from '@src/database.js'
import { hasQueue } from '@dao/has-queue.js'
import { QueueNotFound } from '@src/contract.js'
import { eventHub, Event } from '@src/event-hub.js'

/**
 * @throws {QueueNotFound}
 */
export const draftMessage = withLazyStatic((
  queueId: string
, priority: number | null
, slotNames: NonEmptyArray<string>
): string => {
  assert(isntEmptyArray(slotNames), 'The slotNames cannot be empty.')

  const messageId = nanoid()
  const timestamp = getTimestamp()

  lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  , priority: number | null
  , slotNames: NonEmptyArray<string>
  , timestamp: number
  ) => {
    if (!hasQueue(queueId)) throw new QueueNotFound()

    _draftMessage(queueId, messageId, priority, slotNames, timestamp)
  }), [getDatabase()])(queueId, messageId, priority, slotNames, timestamp)

  eventHub.emit(queueId, Event.DraftingMessageAdded)

  return messageId
})
