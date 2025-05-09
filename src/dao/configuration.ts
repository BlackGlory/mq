import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { IConfiguration } from '@src/contract.js'

export const getAllNamespacesWithConfiguration = withLazyStatic(function (): string[] {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM mq_configuration;
  `), [getDatabase()]).all() as Array<{ namespace: string }>

  return result.map(x => x['namespace'])
})

export const getConfiguration = withLazyStatic((namespace: string): IConfiguration => {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT uniq
         , drafting_timeout
         , ordered_timeout
         , active_timeout
         , concurrency
      FROM mq_configuration
     WHERE namespace = $namespace;
  `), [getDatabase()]).get({ namespace }) as {
    uniq: number | null
    drafting_timeout: number | null
    ordered_timeout: number | null
    active_timeout: number | null
    concurrency: number | null
  } | undefined

  if (row) {
    const unique = row['uniq']
    return {
      unique: unique === null
            ? null
            : numberToBoolean(unique)
    , draftingTimeout: row['drafting_timeout']
    , orderedTimeout: row['ordered_timeout']
    , activeTimeout: row['active_timeout']
    , concurrency: row['concurrency']
    }
  } else {
    return {
      unique: null
    , draftingTimeout: null
    , orderedTimeout: null
    , activeTimeout: null
    , concurrency: null
    }
  }
})

export const setUnique = withLazyStatic(function (namespace: string, val: boolean): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_configuration (namespace, uniq)
    VALUES ($namespace, $unique)
        ON CONFLICT(namespace)
        DO UPDATE SET uniq = $unique;
  `), [getDatabase()]).run({ namespace, unique: booleanToNumber(val) })
})

export const unsetUnique = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_configuration
         SET uniq = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  }), [getDatabase()])(namespace)
})

export const setDraftingTimeout = withLazyStatic(function (namespace: string, val: number): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_configuration (namespace, drafting_timeout)
    VALUES ($namespace, $draftingTimeout)
        ON CONFLICT(namespace)
        DO UPDATE SET drafting_timeout = $draftingTimeout;
  `), [getDatabase()]).run({ namespace, draftingTimeout: val })
})

export const unsetDraftingTimeout = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_configuration
         SET drafting_timeout = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  }), [getDatabase()])(namespace)
})

export const setOrderedTimeout = withLazyStatic(function (
  namespace: string
, val: number
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_configuration (namespace, ordered_timeout)
    VALUES ($namespace, $orderedTimeout)
        ON CONFLICT(namespace)
        DO UPDATE SET ordered_timeout = $orderedTimeout;
  `), [getDatabase()]).run({ namespace, orderedTimeout: val })
})

export const unsetOrderedTimeout = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_configuration
         SET ordered_timeout = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  }), [getDatabase()])(namespace)
})

export const setActiveTimeout = withLazyStatic(function (
  namespace: string
, val: number
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_configuration (namespace, active_timeout)
    VALUES ($namespace, $activeTimeout)
        ON CONFLICT(namespace)
        DO UPDATE SET active_timeout = $activeTimeout;
  `), [getDatabase()]).run({ namespace, activeTimeout: val })
})

export const unsetActiveTimeout = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_configuration
         SET active_timeout = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  }), [getDatabase()])(namespace)
})

export const setConcurrency = withLazyStatic(function (
  namespace: string
, val: number
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_configuration (namespace, concurrency)
    VALUES ($namespace, $concurrency)
        ON CONFLICT(namespace)
        DO UPDATE SET concurrency = $concurrency;
  `), [getDatabase()]).run({ namespace, concurrency: val })
})

export const unsetConcurrency = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_configuration
         SET concurrency = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  }), [getDatabase()])(namespace)
})

const deleteNoConfigurationsRow = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM mq_configuration
     WHERE namespace = $namespace
       AND uniq = NULL
       AND drafting_timeout = NULL
       AND ordered_timeout = NULL
       AND active_timeout = NULL
       AND concurrency = NULL
  `), [getDatabase()]).run({ namespace })
})

function numberToBoolean(val: number): boolean {
  if (val === 0) {
    return false
  } else {
    return true
  }
}

function booleanToNumber(val: boolean): number {
  if (val) {
    return 1
  } else {
    return 0
  }
}
