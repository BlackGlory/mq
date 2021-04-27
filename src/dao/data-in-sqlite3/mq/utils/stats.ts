import { getDatabase } from '../../database'

export function increaseDrafting(namespace: string, num: number = 1): void {
  getDatabase().prepare(`
    INSERT INTO mq_stats (namespace, drafting)
    VALUES ($namespace, $num)
        ON CONFLICT (namespace)
        DO UPDATE SET drafting = drafting + $num;
  `).run({ namespace, num })
}

export function downcreaseDrafting(namespace: string, num: number = 1): void {
  getDatabase().prepare(`
    UPDATE mq_stats
       SET drafting = drafting - $num
     WHERE namespace = $namespace;
  `).run({ namespace, num })
}

export function increaseWaiting(namespace: string, num: number = 1): void {
  getDatabase().prepare(`
    INSERT INTO mq_stats (namespace, waiting)
    VALUES ($namespace, $num)
        ON CONFLICT (namespace)
        DO UPDATE SET waiting = waiting + $num;
  `).run({ namespace, num })
}

export function downcreaseWaiting(namespace: string, num: number = 1): void {
  getDatabase().prepare(`
    UPDATE mq_stats
       SET waiting = waiting - $num
     WHERE namespace = $namespace;
  `).run({ namespace, num })
}

export function increaseOrdered(namespace: string, num: number = 1): void {
  getDatabase().prepare(`
    INSERT INTO mq_stats (namespace, ordered)
    VALUES ($namespace, $num)
        ON CONFLICT (namespace)
        DO UPDATE SET ordered = ordered + $num;
  `).run({ namespace, num })
}

export function downcreaseOrdered(namespace: string, num: number = 1): void {
  getDatabase().prepare(`
    UPDATE mq_stats
       SET ordered = ordered - $num
     WHERE namespace = $namespace;
  `).run({ namespace, num })
}

export function increaseActive(namespace: string, num: number = 1): void {
  getDatabase().prepare(`
    INSERT INTO mq_stats (namespace, active)
    VALUES ($namespace, $num)
        ON CONFLICT (namespace)
        DO UPDATE SET active = active + $num;
  `).run({ namespace, num })
}

export function downcreaseActive(namespace: string, num: number = 1): void {
  getDatabase().prepare(`
    UPDATE mq_stats
       SET active = active - $num
     WHERE namespace = $namespace;
  `).run({ namespace, num })
}

export function increaseCompleted(namespace: string, num: number = 1): void {
  getDatabase().prepare(`
    INSERT INTO mq_stats (namespace, completed)
    VALUES ($namespace, $num)
        ON CONFLICT (namespace)
        DO UPDATE SET completed = completed + $num
  `).run({ namespace, num })
}

export function increaseFailed(namespace: string, num: number = 1): void {
  getDatabase().prepare(`
    INSERT INTO mq_stats (namespace, failed)
    VALUES ($namespace, $num)
        ON CONFLICT (namespace)
        DO UPDATE SET failed = failed + $num
  `).run({ namespace, num })
}

export function downcreaseFailed(namespace: string, num: number = 1): void {
  getDatabase().prepare(`
    UPDATE mq_stats
       SET failed = failed - $num
     WHERE namespace = $namespace;
  `).run({ namespace, num })
}
