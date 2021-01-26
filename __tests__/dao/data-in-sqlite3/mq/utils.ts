import { getDatabase } from '@dao/data-in-sqlite3/database'

type IState = 'drafting' | 'waiting' | 'ordered' | 'active' | 'completed'

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
}

interface IRawThrottle {
  mq_id: string
  cycle_start_time: number
  count: number
}

export function setRawThrottle(props: IRawThrottle): void {
  getDatabase().prepare(`
    INSERT INTO mq_throttle (mq_id, cycle_start_time, count)
    VALUES ($mq_id, $cycle_start_time, $count)
  `).run(props)
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

export function setRawMessage(props: IRawMessage): void {
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
  `).run(props)
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

export function setRawStats(props: IRawStats) {
  return getDatabase().prepare(`
    INSERT INTO mq_stats (
      mq_id
    , drafting
    , waiting
    , ordered
    , active
    , completed
    )
    VALUES (
      $mq_id
    , $drafting
    , $waiting
    , $ordered
    , $active
    , $completed
    );
  `).run(props)
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
