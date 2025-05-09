import { getDatabase } from '@src/database.js'
import { MapNullablePropsToOptional } from 'hotypes'

type IState = 'drafting' | 'waiting' | 'ordered' | 'active' | 'completed' | 'failed'

interface IRawConfiguration {
  namespace: string
  uniq: number | null
  drafting_timeout: number | null
  ordered_timeout: number | null
  active_timeout: number | null
  concurrency: number | null
}

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

export function getRawMessage(namespace: string, messageId: string): IRawMessage | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_message
     WHERE namespace = $namespace
       AND id = $messageId;
  `).get({ namespace, messageId }) as IRawMessage | undefined
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

export function getRawStats(namespace: string): IRawStats | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_stats
     WHERE namespace = $namespace;
  `).get({ namespace }) as IRawStats | undefined
}

export function setRawConfiguration<T extends IRawConfiguration>(raw: T): T {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (
      namespace
    , uniq
    , drafting_timeout
    , ordered_timeout
    , active_timeout
    , concurrency
    )
    VALUES (
      $namespace
    , $uniq
    , $drafting_timeout
    , $ordered_timeout
    , $active_timeout
    , $concurrency
    );
  `).run(raw)

  return raw
}

export function setMinimalConfiguration(
  raw: MapNullablePropsToOptional<IRawConfiguration>
): IRawConfiguration {
  return setRawConfiguration({
    namespace: raw.namespace
  , drafting_timeout: raw.drafting_timeout ?? null
  , ordered_timeout: raw.ordered_timeout ?? null
  , active_timeout: raw.active_timeout ?? null
  , concurrency: raw.concurrency ?? null
  , uniq: raw.uniq ?? null
  })
}

export function hasRawConfiguration(namespace: string): boolean {
  return !!getRawConfiguration(namespace)
}

export function getRawConfiguration(namespace: string): IRawConfiguration | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_configuration
     WHERE namespace = $namespace;
  `).get({ namespace }) as IRawConfiguration | undefined
}
