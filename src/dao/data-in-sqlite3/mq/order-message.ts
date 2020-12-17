import { getDatabase } from '../database'
import { getTimestamp } from './utils/get-timestamp'
import { downcreaseWaiting, increaseOrdered } from './utils/stats'

export function orderMessage(queueId: string, duration: number, limit: number): string | null {
  const db = getDatabase()

  return db.transaction(() => {
    const now = getTimestamp()

    const throttle = getThrottle(queueId)
    if (throttle) {
      if (inThrottleCycle()) {
        if (overLimit()) return null
      } else {
        updateThrottleCycle(queueId, {
          duration
        , now
        , oldCycleStartTime: throttle.cycleStartTime
        })
      }
      countupThrottle(queueId)
      return order(queueId, now)
    } else {
      initThrottle(queueId, now)
      countupThrottle(queueId)
      return order(queueId, now)
    }

    function overLimit(): boolean {
      return throttle!.count >= limit
    }

    function inThrottleCycle(): boolean {
      return now - duration <= throttle!.cycleStartTime
    }
  })()
}

function getThrottle(queueId: string): IThrottle | null {
  const row = getDatabase().prepare(`
    SELECT cycle_start_time
          , count
      FROM mq_throttle
     WHERE mq_id = $queueId;
  `).get({ queueId })
  if (row) {
    return {
      cycleStartTime: row['cycle_start_time']
    , count: row['count']
    }
  } else {
    return null
  }
}

function order(queueId: string, now: number): string | null {
  const db = getDatabase()

  const row = db.prepare(`
    SELECT message_id
      FROM mq_message
     WHERE mq_id = $queueId
       AND state = 'waiting'
     ORDER BY priority         ASC NULLS LAST
            , state_updated_at ASC
     LIMIT 1;
  `).get({ queueId })
  if (!row) return null
  const messageId = row['message_id'] as string

  db.prepare(`
    UPDATE mq_message
       SET state = 'ordered'
         , state_updated_at = $stateUpdatedAt
     WHERE mq_id = $queueId
       AND message_id = $messageId;
  `).run({
    queueId
  , messageId
  , stateUpdatedAt: now
  })

  downcreaseWaiting(queueId)
  increaseOrdered(queueId)

  return messageId
}

function updateThrottleCycle(queueId: string, { duration, now, oldCycleStartTime }: {
  duration: number
  now: number
  oldCycleStartTime: number
}): void {
  const cycleStartTime = newCycleStartTime({ duration, now, oldCycleStartTime })
  getDatabase().prepare(`
    UPDATE mq_throttle
       SET cycle_start_time = $cycleStartTime
         , count = 0
     WHERE mq_id = $queueId;
  `).run({ queueId, cycleStartTime })
}

function initThrottle(queueId: string, startTime: number): void {
  getDatabase().prepare(`
    INSERT INTO mq_throttle (mq_id, cycle_start_time)
    VALUES ($queueId, $startTime);
  `).run({ queueId, startTime })
}

function countupThrottle(queueId: string): void {
  getDatabase().prepare(`
    UPDATE mq_throttle
       SET count = count + 1
     WHERE mq_id = $queueId;
  `).run({ queueId })
}

function newCycleStartTime({ now, duration, oldCycleStartTime }: {
  now: number
  duration: number
  oldCycleStartTime: number
}): number {
  const cycles = Math.floor((now - oldCycleStartTime) / duration)
  return oldCycleStartTime + cycles * duration
}
