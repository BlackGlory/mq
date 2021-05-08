import { getDatabase } from '@dao/data-in-sqlite3/database'
import { MapNullablePropsToOptional } from 'hotypes'

type IState = 'drafting' | 'waiting' | 'ordered' | 'active' | 'completed' | 'failed'

interface IRawMessage {
  namespace: string
  id: string
  priority: number | null
  type: string | null
  payload: string | null
  hash: string | null
  state: IState
  state_updated_at: number
}

interface IRawStats {
  namespace: string
  drafting: number
  waiting: number
  ordered: number
  active: number
  completed: number
  failed: number
}

interface IRawThrottle {
  namespace: string
  cycle_start_time: number
  count: number
}

export function setRawThrottle(raw: IRawThrottle): IRawThrottle {
  getDatabase().prepare(`
    INSERT INTO mq_throttle (namespace, cycle_start_time, count)
    VALUES ($namespace, $cycle_start_time, $count)
  `).run(raw)

  return raw
}

export function hasRawThrottle(namespace: string): boolean {
  return !!getRawThrottle(namespace)
}

export function getRawThrottle(namespace: string): IRawThrottle | null {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_throttle
     WHERE namespace = $namespace;
  `).get({ namespace })
}

export function setRawMessage<T extends IRawMessage>(raw: T): T {
  getDatabase().prepare(`
    INSERT INTO mq_message (
      namespace
    , id
    , priority
    , type
    , payload
    , hash
    , state
    , state_updated_at
    )
    VALUES (
      $namespace
    , $id
    , $priority
    , $type
    , $payload
    , $hash
    , $state
    , $state_updated_at
    );
  `).run(raw)

  return raw
}

export function setMinimalRawMessage(raw: MapNullablePropsToOptional<IRawMessage>): IRawMessage {
  return setRawMessage({
    namespace: raw.namespace
  , id: raw.id
  , priority: raw.priority ?? null
  , type: raw.type ?? null
  , payload: raw.payload ?? null
  , hash: raw.hash ?? null
  , state: raw.state
  , state_updated_at: raw.state_updated_at
  })
}

export function hasRawMessage(namespace: string, messageId: string): boolean {
  return !!getRawMessage(namespace, messageId)
}

export function getRawMessage(namespace: string, messageId: string): IRawMessage | null {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_message
     WHERE namespace = $namespace
       AND id = $messageId;
  `).get({ namespace, messageId })
}

export function setRawStats(item: IRawStats): IRawStats {
  getDatabase().prepare(`
    INSERT INTO mq_stats (
      namespace
    , drafting
    , waiting
    , ordered
    , active
    , completed
    , failed
    )
    VALUES (
      $namespace
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

export function hasRawStats(namespace: string): boolean {
  return !!getRawStats(namespace)
}

export function getRawStats(namespace: string): IRawStats | null {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_stats
     WHERE namespace = $namespace;
  `).get({ namespace })
}
