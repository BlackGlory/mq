import { MessageState } from '@src/contract.js'
import { getDatabase } from '@src/database.js'

interface IRawQueue {
  id: string

  uniq: number
  drafting_timeout: number
  ordered_timeout: number
  active_timeout: number
  concurrency: number | null
  behavior_when_completed: number
  behavior_when_abandoned: number

  drafting: number
  waiting: number
  ordered: number
  active: number
  failed: number
  completed: number
  abandoned: number
}

interface IRawMessage {
  queue_id: string
  id: string
  priority: number | null
  hash: string | null
  state: MessageState
  state_updated_at: number
}

interface IRawMessageSlot {
  queue_id: string
  message_id: string
  name: string
  value: string | null
}

export function setRawQueue(raw: IRawQueue): IRawQueue {
  getDatabase().prepare(`
    INSERT INTO mq_queue (
      id

    , uniq
    , drafting_timeout
    , ordered_timeout
    , active_timeout
    , concurrency
    , behavior_when_completed
    , behavior_when_abandoned

    , drafting
    , waiting
    , ordered
    , active
    , faield
    , completed
    , abandoned
    )
    VALUES (
      $id

    , $uniq
    , $drafting_timeout
    , $ordered_timeout
    , $active_timeout
    , $concurrency
    , $behavior_when_completed
    , $behavior_when_abandoned

    , $drafting
    , $waiting
    , $ordered
    , $active
    , $faield
    , $completed
    , $abandoned
    );
  `).run(raw)

  return raw
}

export function hasRawQueue(queueId: string): boolean {
  return !!getRawQueue(queueId)
}

export function getRawQueue(queueId: string): IRawQueue | undefined {
  return getDatabase().prepare<{ queueId: string }, IRawQueue>(`
    SELECT *
      FROM mq_queue
     WHERE id = $queueId;
  `).get({ queueId })
}

export function setRawMessage<T extends IRawMessage>(raw: T): T {
  getDatabase().prepare(`
    INSERT INTO mq_message (
      queue_id
    , id
    , priority
    , hash
    , state
    , state_updated_at
    )
    VALUES (
      $queue_id
    , $id
    , $priority
    , $hash
    , $state
    , $state_updated_at
    );
  `).run(raw)

  return raw
}

export function hasRawMessage(queueId: string, messageId: string): boolean {
  return !!getRawMessage(queueId, messageId)
}

export function getRawMessage(queueId: string, messageId: string): IRawMessage | undefined {
  return getDatabase().prepare<
    {
      queueId: string
      messageId: string
    }
  , IRawMessage
  >(`
    SELECT *
      FROM mq_message
     WHERE queue_id = $queueId
       AND id = $messageId;
  `).get({ queueId, messageId })
}

export function setRawMessageSlot<T extends IRawMessageSlot>(raw: T): T {
  getDatabase().prepare(`
    INSERT INTO mq_message_slot (
      queue_id
    , message_id
    , name
    , value
    )
    VALUES (
      $queue_id
    , $message_id
    , $name
    , $value
    );
  `).run(raw)

  return raw
}

export function hasRawMessageSlot(
  queueId: string
, messageId: string
, slotName: string
): boolean {
  return !!getRawMessageSlot(queueId, messageId, slotName)
}

export function getRawMessageSlot(
  queueId: string
, messageId: string
, slotName: string
): IRawMessageSlot | undefined {
  return getDatabase().prepare<
    {
      queueId: string
      messageId: string
      slotName: string
    }
  , IRawMessageSlot
  >(`
    SELECT *
      FROM mq_message_slot
     WHERE queue_id = $queueId
       AND message_id = $messageId
       AND name = $slotName;
  `).get({ queueId, messageId, slotName })
}
