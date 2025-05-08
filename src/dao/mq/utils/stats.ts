import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const increaseDrafting = withLazyStatic(function (
  namespace: string
, num: number = 1
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_stats (namespace, drafting)
    VALUES ($namespace, $num)
        ON CONFLICT (namespace)
        DO UPDATE SET drafting = drafting + $num;
  `), [getDatabase()]).run({ namespace, num })
})

export const downcreaseDrafting = withLazyStatic(function (
  namespace: string
, num: number = 1
): void {
  lazyStatic(() => getDatabase().prepare(`
    UPDATE mq_stats
       SET drafting = drafting - $num
     WHERE namespace = $namespace;
  `), [getDatabase()]).run({ namespace, num })
})

export const increaseWaiting = withLazyStatic(function (
  namespace: string
, num: number = 1
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_stats (namespace, waiting)
    VALUES ($namespace, $num)
        ON CONFLICT (namespace)
        DO UPDATE SET waiting = waiting + $num;
  `), [getDatabase()]).run({ namespace, num })
})

export const downcreaseWaiting = withLazyStatic(function (
  namespace: string
, num: number = 1
): void {
  lazyStatic(() => getDatabase().prepare(`
    UPDATE mq_stats
       SET waiting = waiting - $num
     WHERE namespace = $namespace;
  `), [getDatabase()]).run({ namespace, num })
})

export const increaseOrdered = withLazyStatic(function (
  namespace: string
, num: number = 1
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_stats (namespace, ordered)
    VALUES ($namespace, $num)
        ON CONFLICT (namespace)
        DO UPDATE SET ordered = ordered + $num;
  `), [getDatabase()]).run({ namespace, num })
})

export const downcreaseOrdered = withLazyStatic(function (
  namespace: string
, num: number = 1
): void {
  lazyStatic(() => getDatabase().prepare(`
    UPDATE mq_stats
       SET ordered = ordered - $num
     WHERE namespace = $namespace;
  `), [getDatabase()]).run({ namespace, num })
})

export const increaseActive = withLazyStatic(function (
  namespace: string
, num: number = 1
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_stats (namespace, active)
    VALUES ($namespace, $num)
        ON CONFLICT (namespace)
        DO UPDATE SET active = active + $num;
  `), [getDatabase()]).run({ namespace, num })
})

export const downcreaseActive = withLazyStatic(function (
  namespace: string
, num: number = 1
): void {
  lazyStatic(() => getDatabase().prepare(`
    UPDATE mq_stats
       SET active = active - $num
     WHERE namespace = $namespace;
  `), [getDatabase()]).run({ namespace, num })
})

export const increaseCompleted = withLazyStatic(function (
  namespace: string
, num: number = 1
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_stats (namespace, completed)
    VALUES ($namespace, $num)
        ON CONFLICT (namespace)
        DO UPDATE SET completed = completed + $num
  `), [getDatabase()]).run({ namespace, num })
})

export const increaseFailed = withLazyStatic(function (
  namespace: string
, num: number = 1
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_stats (namespace, failed)
    VALUES ($namespace, $num)
        ON CONFLICT (namespace)
        DO UPDATE SET failed = failed + $num
  `), [getDatabase()]).run({ namespace, num })
})

export const downcreaseFailed = withLazyStatic(function (
  namespace: string
, num: number = 1
): void {
  lazyStatic(() => getDatabase().prepare(`
    UPDATE mq_stats
       SET failed = failed - $num
     WHERE namespace = $namespace;
  `), [getDatabase()]).run({ namespace, num })
})
