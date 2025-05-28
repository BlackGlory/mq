import { JSONValue } from 'justypes'
import { setMessageSlot as _setMessageSlot } from '@dao/set-message-slot.js'
import { getTimestamp } from '@utils/get-timestamp.js'
import { eventHub, Event } from '@src/event-hub.js'

/**
 * @throws {QueueNotFound}
 * @throws {MessageNotFound}
 * @throws {SlotNotFound}
 * @throws {BadMessageState}
 * @throws {DuplicateMessage}
 */
export function setMessageSlot(
  queueId: string
, messageId: string
, slotName: string
, value: JSONValue
): null {
  const timestamp = getTimestamp()

  const { draftingToWaiting } = _setMessageSlot(
    queueId
  , messageId
  , slotName
  , value
  , timestamp
  )
  if (draftingToWaiting) eventHub.emit(queueId, Event.MessageStateDraftingToWaiting)

  return null
}
