import { getDatabase } from '../../database'

export function increaseDrafting(queueId: string, num: number = 1): void {
  getDatabase().prepare(`
    INSERT INTO mq_stats (mq_id, drafting)
    VALUES ($queueId, $num)
        ON CONFLICT (mq_id)
        DO UPDATE SET drafting = drafting + $num;
  `).run({ queueId, num })
}

export function downcreaseDrafting(queueId: string, num: number = 1): void {
  getDatabase().prepare(`
    UPDATE mq_stats
       SET drafting = drafting - $num
     WHERE mq_id = $queueId;
  `).run({ queueId, num })
}

export function increaseWaiting(queueId: string, num: number = 1): void {
  getDatabase().prepare(`
    INSERT INTO mq_stats (mq_id, waiting)
    VALUES ($queueId, $num)
        ON CONFLICT (mq_id)
        DO UPDATE SET waiting = waiting + $num;
  `).run({ queueId, num })
}

export function downcreaseWaiting(queueId: string, num: number = 1): void {
  getDatabase().prepare(`
    UPDATE mq_stats
       SET waiting = waiting - $num
     WHERE mq_id = $queueId;
  `).run({ queueId, num })
}

export function increaseOrdered(queueId: string, num: number = 1): void {
  getDatabase().prepare(`
    INSERT INTO mq_stats (mq_id, ordered)
    VALUES ($queueId, $num)
        ON CONFLICT (mq_id)
        DO UPDATE SET ordered = ordered + $num;
  `).run({ queueId, num })
}

export function downcreaseOrdered(queueId: string, num: number = 1): void {
  getDatabase().prepare(`
    UPDATE mq_stats
       SET ordered = ordered - $num
     WHERE mq_id = $queueId;
  `).run({ queueId, num })
}

export function increaseActive(queueId: string, num: number = 1): void {
  getDatabase().prepare(`
    INSERT INTO mq_stats (mq_id, active)
    VALUES ($queueId, $num)
        ON CONFLICT (mq_id)
        DO UPDATE SET active = active + $num;
  `).run({ queueId, num })
}

export function downcreaseActive(queueId: string, num: number = 1): void {
  getDatabase().prepare(`
    UPDATE mq_stats
       SET active = active - $num
     WHERE mq_id = $queueId;
  `).run({ queueId, num })
}

export function increaseCompleted(queueId: string, num: number = 1): void {
  getDatabase().prepare(`
    INSERT INTO mq_stats (mq_id, completed)
    VALUES ($queueId, $num)
        ON CONFLICT (mq_id)
        DO UPDATE SET completed = completed + $num
  `).run({ queueId, num })
}

export function increaseFailed(queueId: string, num: number = 1): void {
  getDatabase().prepare(`
    INSERT INTO mq_stats (mq_id, failed)
    VALUES ($queueId, $num)
        ON CONFLICT (mq_id)
        DO UPDATE SET failed = failed + $num
  `).run({ queueId, num })
}

export function downcreaseFailed(queueId: string, num: number = 1): void {
  getDatabase().prepare(`
    UPDATE mq_stats
       SET failed = failed - $num
     WHERE mq_id = $queueId;
  `).run({ queueId, num })
}
