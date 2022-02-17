import { getDatabase } from '../database'
import { getTimestamp } from './utils/get-timestamp'
import { downcreaseWaiting, increaseOrdered } from './utils/stats'
import { stats } from './stats'
import { assert } from '@blackglory/errors'

export function orderMessage(
  namespace: string
, concurrency: number
, throttleDuration: number
, throttleLimit: number
): string | null {
  const db = getDatabase()

  return db.transaction(() => {
    const { active, ordered } = stats(namespace)
    if (active + ordered >= concurrency) return null

    const now = getTimestamp()

    const throttle = getThrottle(namespace)
    if (throttle) {
      if (inThrottleCycle()) {
        if (overLimit()) return null
      } else {
        updateThrottleCycle(namespace, {
          duration: throttleDuration
        , now
        , oldCycleStartTime: throttle.cycleStartTime
        })
      }
      countupThrottle(namespace)
      return order(namespace, now)
    } else {
      initThrottle(namespace, now)
      countupThrottle(namespace)
      return order(namespace, now)
    }

    function overLimit(): boolean {
      assert(throttle, 'Throttle is not found')
      return throttle.count >= throttleLimit
    }

    function inThrottleCycle(): boolean {
      assert(throttle, 'Throttle is not found')
      return now - throttleDuration <= throttle.cycleStartTime
    }
  })()
}

function getThrottle(namespace: string): IThrottle | null {
  const row = getDatabase().prepare(`
    SELECT cycle_start_time
         , count
      FROM mq_throttle
     WHERE namespace = $namespace;
  `).get({ namespace })
  if (!row) return null

  return {
    cycleStartTime: row['cycle_start_time']
  , count: row['count']
  }
}

function order(namespace: string, now: number): string | null {
  const db = getDatabase()

  const row = db.prepare(`
    SELECT id
      FROM mq_message
     WHERE namespace = $namespace
       AND state = 'waiting'
     ORDER BY priority         ASC NULLS LAST
            , state_updated_at ASC
            , rowid            ASC
     LIMIT 1;
  `).get({ namespace })
  if (!row) return null

  const id = row['id'] as string
  db.prepare(`
    UPDATE mq_message
       SET state = 'ordered'
         , state_updated_at = $stateUpdatedAt
     WHERE namespace = $namespace
       AND id = $id;
  `).run({
    namespace
  , id
  , stateUpdatedAt: now
  })

  downcreaseWaiting(namespace)
  increaseOrdered(namespace)

  return id
}

function updateThrottleCycle(
  namespace: string
, { duration, now, oldCycleStartTime }: {
    duration: number
    now: number
    oldCycleStartTime: number
  }
): void {
  const cycleStartTime = newCycleStartTime({ duration, now, oldCycleStartTime })
  getDatabase().prepare(`
    UPDATE mq_throttle
       SET cycle_start_time = $cycleStartTime
         , count = 0
     WHERE namespace = $namespace;
  `).run({ namespace, cycleStartTime })
}

function initThrottle(namespace: string, startTime: number): void {
  getDatabase().prepare(`
    INSERT INTO mq_throttle (namespace, cycle_start_time)
    VALUES ($namespace, $startTime);
  `).run({ namespace, startTime })
}

function countupThrottle(namespace: string): void {
  getDatabase().prepare(`
    UPDATE mq_throttle
       SET count = count + 1
     WHERE namespace = $namespace;
  `).run({ namespace })
}

function newCycleStartTime({ now, duration, oldCycleStartTime }: {
  now: number
  duration: number
  oldCycleStartTime: number
}): number {
  const cycles = Math.floor((now - oldCycleStartTime) / duration)
  return oldCycleStartTime + cycles * duration
}
