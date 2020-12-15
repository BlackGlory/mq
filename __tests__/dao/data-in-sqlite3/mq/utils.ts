import { Database } from 'better-sqlite3'

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

export function setRawThrottle(db: Database, props: IRawThrottle): void {
  db.prepare(`
    INSERT INTO mq_throttle (mq_id, cycle_start_time, count)
    VALUES ($mq_id, $cycle_start_time, $count)
  `).run(props)
}

export function hasRawThrottle(db: Database, queueId: string): boolean {
  return !!selectThrottle(db, queueId)
}

export function getRawThrottle(db: Database, queueId: string): IRawThrottle {
  return selectThrottle(db, queueId)
}

export function setRawMessage(db: Database, props: IRawMessage): void {
  db.prepare(`
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

export function hasRawMessage(db: Database, queueId: string, messageId: string): boolean {
  return !!selectMessage(db, queueId, messageId)
}

export function getRawMessage(db: Database, queueId: string, messageId: string): IRawMessage {
  return selectMessage(db, queueId, messageId)
}

export function setRawStats(db: Database, props: IRawStats) {
  return db.prepare(`
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

export function hasRawStats(db: Database, queueId: string): boolean {
  return !!selectStats(db, queueId)
}

export function getRawStats(db: Database, queueId: string): IRawStats {
  return selectStats(db, queueId)
}

function selectThrottle(db: Database, queueId: string) {
  return db.prepare(`
    SELECT *
      FROM mq_throttle
     WHERE mq_id = $queueId;
  `).get({ queueId })
}

function selectMessage(db: Database, queueId: string, messageId: string) {
  return db.prepare(`
    SELECT * FROM mq_message
     WHERE mq_id = $queueId
       AND message_id = $messageId;
  `).get({ queueId, messageId })
}

function selectStats(db: Database, queueId: string) {
  return db.prepare(`
    SELECT *
      FROM mq_stats
     WHERE mq_id = $queueId;
  `).get({ queueId })
}
