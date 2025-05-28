import { getDatabase } from '@src/database.js'
import { JSONValue } from 'justypes'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { BadMessageState, DuplicateMessage, MessageNotFound, MessageState, QueueNotFound, SlotNotFound } from '@src/contract.js'
import { getQueueConfiguration } from './get-queue-configuration.js'
import { increaseDrafting, increaseWaiting } from './increase-queue-stats.js'
import { getMessageState } from './get-message-state.js'
import { isntNull, isNull } from '@blackglory/prelude'
import { hash } from '@utils/hash.js'
import { stringify as jsonStableStringify } from 'extra-json-stable-stringify'
import { fromEntries } from 'extra-utils'

/**
 * @throws {QueueNotFound}
 * @throws {MessageNotFound}
 * @throws {BadMessageState}
 * @throws {DuplicateMessage}
 */
export const setMessageSlot = withLazyStatic((
  queueId: string
, messageId: string
, slotName: string
, value: JSONValue
, timestamp: number
): { draftingToWaiting: boolean } => {
  return lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  , slotName: string
  , value: JSONValue
  , timestamp: number
  ): { draftingToWaiting: boolean } => {
    const config = getQueueConfiguration(queueId)
    if (!config) throw new QueueNotFound()

    const messageState = getMessageState(queueId, messageId)
    if (isNull(messageState)) throw new MessageNotFound()
    if (
      messageState !== MessageState.Drafting &&
      messageState !== MessageState.Waiting
    ) {
      throw new BadMessageState(MessageState.Drafting, MessageState.Waiting)
    }

    const updateSlotStatement = lazyStatic(() => getDatabase().prepare<{
      queueId: string
      messageId: string
      name: string
      value: string
    }>(`
      UPDATE mq_message_slot
         SET value = $value
       WHERE queue_id = $queueId
         AND message_id = $messageId
         AND name = $name;
    `), [getDatabase()])

    const getAllSlotsStatement = lazyStatic(() => getDatabase().prepare<
      {
        queueId: string
        messageId: string
      }
    , {
        name: string
        value: string | null
      }
    >(`
      SELECT name
           , value
        FROM mq_message_slot
       WHERE queue_id = $queueId
         AND message_id = $messageId
    `), [getDatabase()])

    const hasDuplicateMessageByHashStatement = lazyStatic(() => getDatabase().prepare<
      {
        queueId: string
        messageId: string
        hash: string
      }
    , { matched: 1 | 0 }
    >(`
      SELECT EXISTS(
               SELECT 1
                 FROM mq_message
                WHERE queue_id = $queueId
                  AND id != $messageId
                  AND hash = $hash
             ) AS matched;
    `), [getDatabase()])

    const updateMessageStateToWaitingStatement = lazyStatic(() => getDatabase().prepare<{
      queueId: string
      messageId: string
      stateUpdatedAt: number
    }>(`
      UPDATE mq_message
         SET state = ${MessageState.Waiting}
           , state_updated_at = $stateUpdatedAt
       WHERE queue_id = $queueId
         AND id = $messageId
    `), [getDatabase()])

    const updateMessageHashStatement = lazyStatic(() => getDatabase().prepare<{
      queueId: string
      messageId: string
      hash: string
    }>(`
      UPDATE mq_message
         SET hash = $hash
       WHERE queue_id = $queueId
         AND id = $messageId
    `), [getDatabase()])

    if (config.unique) {
      const slots = getAllSlotsStatement.all({ queueId, messageId })

      const nullSlots = slots.filter(x => isNull(x.value))
      if (
        nullSlots.length === 0 ||
        (
          nullSlots.length === 1 &&
          nullSlots[0].name === slotName
        )
      ) {
        const jsonValue = jsonStableStringify(value)

        const slotsObject = fromEntries(slots.map(x => [x.name, x.value]))
        slotsObject[slotName] = jsonValue

        const messageHash = hash(jsonStableStringify(slotsObject))
        if (
          hasDuplicateMessageByHashStatement.get({
            queueId
          , messageId
          , hash: messageHash
          })?.matched
        ) {
          throw new DuplicateMessage()
        }

        updateSlotStatement.run({
          queueId
        , messageId
        , name: slotName
        , value: jsonValue
        })
        updateMessageHashStatement.run({
          queueId
        , messageId
        , hash: messageHash
        })

        if (messageState === MessageState.Drafting) {
          updateMessageStateToWaitingStatement.run({
            queueId
          , messageId
          , stateUpdatedAt: timestamp
          })
          increaseDrafting(queueId, -1)
          increaseWaiting(queueId, 1)

          return { draftingToWaiting: true }
        }

        return { draftingToWaiting: false }
      } else {
        const { changes } = updateSlotStatement.run({
          queueId
        , messageId
        , name: slotName
        , value: jsonStableStringify(value)
        })
        if (changes === 0) throw new SlotNotFound()

        return { draftingToWaiting: false }
      }
    } else {
      const { changes } = updateSlotStatement.run({
        queueId
      , messageId
      , name: slotName
      , value: JSON.stringify(value)
      })
      if (changes === 0) throw new SlotNotFound()

      if (messageState === MessageState.Drafting) {
        const slots = getAllSlotsStatement.all({ queueId, messageId })

        if (slots.every(x => isntNull(x.value))) {
          updateMessageStateToWaitingStatement.run({
            queueId
          , messageId
          , stateUpdatedAt: timestamp
          })
          increaseDrafting(queueId, -1)
          increaseWaiting(queueId, 1)

          return { draftingToWaiting: true }
        }
      }

      return { draftingToWaiting: false }
    }
  }), [getDatabase()])(queueId, messageId, slotName, value, timestamp)
})
