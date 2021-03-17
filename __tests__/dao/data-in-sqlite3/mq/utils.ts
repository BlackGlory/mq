import { getDatabase } from '@dao/data-in-sqlite3/database'
import { MapNullablePropsToOptionalProps } from 'hotypes'

type IState = 'drafting' | 'waiting' | 'ordered' | 'active' | 'completed' | 'failed'

interface IRawMessage {
  mq_id: string
  message_id: string
  priority: number | null
  type: string | null
  payload: string | null
  hash: string | null
  state: IState
  state_updated_at: number
}

interface IRawStats {
  mq_id: string
  drafting: number
  waiting: number
  ordered: number
  active: number
  completed: number
  failed: number
}

interface IRawThrottle {
  mq_id: string
  cycle_start_time: number
  count: number
}

export function setRawThrottle(item: IRawThrottle): IRawThrottle {
  getDatabase().prepare(`
    INSERT INTO mq_throttle (mq_id, cycle_start_time, count)
    VALUES ($mq_id, $cycle_start_time, $count)
  `).run(item)

  return item
}

export function hasRawThrottle(queueId: string): boolean {
  return !!getRawThrottle(queueId)
}

export function getRawThrottle(queueId: string): IRawThrottle | null {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_throttle
     WHERE mq_id = $queueId;
  `).get({ queueId })
}

export function setRawMessage<T extends IRawMessage>(item: T): T {
  getDatabase().prepare(`
    INSERT INTO mq_message (
      mq_id
    , message_id
    , priority
    , type
    , payload
    , hash
    , state
    , state_updated_at
    )
    VALUES (
      $mq_id
    , $message_id
    , $priority
    , $type
    , $payload
    , $hash
    , $state
    , $state_updated_at
    );
  `).run(item)

  return item
}

export function setMinimalRawMessage(item: MapNullablePropsToOptionalProps<IRawMessage>): IRawMessage {
  return setRawMessage({
    mq_id: item.mq_id
  , message_id: item.message_id
  , priority: item.priority ?? null
  , type: item.type ?? null
  , payload: item.payload ?? null
  , hash: item.hash ?? null
  , state: item.state
  , state_updated_at: item.state_updated_at
  })
}

export function hasRawMessage(queueId: string, messageId: string): boolean {
  return !!getRawMessage(queueId, messageId)
}

export function getRawMessage(queueId: string, messageId: string): IRawMessage | null {
  return getDatabase().prepare(`
    SELECT * FROM mq_message
     WHERE mq_id = $queueId
       AND message_id = $messageId;
  `).get({ queueId, messageId })
}

export function setRawStats(item: IRawStats): IRawStats {
  getDatabase().prepare(`
    INSERT INTO mq_stats (
      mq_id
    , drafting
    , waiting
    , ordered
    , active
    , completed
    , failed
    )
    VALUES (
      $mq_id
    , $drafting
    , $waiting
    , $ordered
    , $active
    , $completed
    , $failed
    );
  `).run(item)

  return item
}

export function hasRawStats(queueId: string): boolean {
  return !!getRawStats(queueId)
}

export function getRawStats(queueId: string): IRawStats | null {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_stats
     WHERE mq_id = $queueId;
  `).get({ queueId })
}
