import { getDatabase } from '../database'

export function getAllIdsWithConfiguration(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM mq_configuration;
  `).all()
  return result.map(x => x['namespace'])
}

export function getConfiguration(namespace: string): IConfiguration {
  const row: {
    'uniq': number | null
    'drafting_timeout': number | null
    'ordered_timeout': number | null
    'active_timeout': number | null
    'concurrency': number | null
  } = getDatabase().prepare(`
    SELECT uniq
         , drafting_timeout
         , ordered_timeout
         , active_timeout
         , concurrency
      FROM mq_configuration
     WHERE namespace = $namespace;
  `).get({ namespace })

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
}

export function setUnique(namespace: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (namespace, uniq)
    VALUES ($namespace, $unique)
        ON CONFLICT(namespace)
        DO UPDATE SET uniq = $unique;
  `).run({ namespace, unique: booleanToNumber(val) })
}

export function unsetUnique(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_configuration
         SET uniq = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  })()
}

export function setDraftingTimeout(namespace: string, val: number): void {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (namespace, drafting_timeout)
    VALUES ($namespace, $draftingTimeout)
        ON CONFLICT(namespace)
        DO UPDATE SET drafting_timeout = $draftingTimeout;
  `).run({ namespace, draftingTimeout: val })
}

export function unsetDraftingTimeout(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_configuration
         SET drafting_timeout = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  })()
}

export function setOrderedTimeout(namespace: string, val: number): void {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (namespace, ordered_timeout)
    VALUES ($namespace, $orderedTimeout)
        ON CONFLICT(namespace)
        DO UPDATE SET ordered_timeout = $orderedTimeout;
  `).run({ namespace, orderedTimeout: val })
}

export function unsetOrderedTimeout(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_configuration
         SET ordered_timeout = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  })()
}

export function setActiveTimeout(namespace: string, val: number): void {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (namespace, active_timeout)
    VALUES ($namespace, $activeTimeout)
        ON CONFLICT(namespace)
        DO UPDATE SET active_timeout = $activeTimeout;
  `).run({ namespace, activeTimeout: val })
}

export function unsetActiveTimeout(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_configuration
         SET active_timeout = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  })()
}

export function setConcurrency(namespace: string, val: number): void {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (namespace, concurrency)
    VALUES ($namespace, $concurrency)
        ON CONFLICT(namespace)
        DO UPDATE SET concurrency = $concurrency;
  `).run({ namespace, concurrency: val })
}

export function unsetConcurrency(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_configuration
         SET concurrency = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  })()
}

function deleteNoConfigurationsRow(namespace: string): void {
  getDatabase().prepare(`
    DELETE FROM mq_configuration
     WHERE namespace = $namespace
       AND uniq = NULL
       AND drafting_timeout = NULL
       AND ordered_timeout = NULL
       AND active_timeout = NULL
       AND concurrency = NULL
  `).run({ namespace })
}

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
