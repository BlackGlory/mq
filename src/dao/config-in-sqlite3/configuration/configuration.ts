import { getDatabase } from '../database'

export function getAllIdsWithConfigurations(): string[] {
  const result = getDatabase().prepare(`
    SELECT mq_id
      FROM mq_configuration;
  `).all()
  return result.map(x => x['mq_id'])
}

export function getConfigurations(id: string): Configurations {
  const row: {
    'uniq': number | null
    'drafting_timeout': number | null
    'ordered_timeout': number | null
    'active_timeout': number | null
    'concurrency': number | null
    'throttle_duration': number | null
    'throttle_limit': number | null
  } = getDatabase().prepare(`
    SELECT uniq
         , drafting_timeout
         , ordered_timeout
         , active_timeout
         , concurrency
         , throttle_duration
         , throttle_limit
      FROM mq_configuration
     WHERE mq_id = $id;
  `).get({ id })

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
    , throttle: row['throttle_duration'] && row['throttle_limit']
              ? {
                  duration: row['throttle_duration']
                , limit: row['throttle_limit']
                }
              : null
    }
  } else {
    return {
      unique: null
    , draftingTimeout: null
    , orderedTimeout: null
    , activeTimeout: null
    , concurrency: null
    , throttle: null
    }
  }
}

export function setUnique(id: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (mq_id, uniq)
    VALUES ($id, $unique)
        ON CONFLICT(mq_id)
        DO UPDATE SET uniq = $unique;
  `).run({ id, unique: booleanToNumber(val) })
}

export function unsetUnique(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_configuration
         SET uniq = NULL
       WHERE mq_id = $id;
    `).run({ id })
    deleteNoConfigurationsRow(id)
  })()
}

export function setDraftingTimeout(id: string, val: number): void {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (mq_id, drafting_timeout)
    VALUES ($id, $draftingTimeout)
        ON CONFLICT(mq_id)
        DO UPDATE SET drafting_timeout = $draftingTimeout;
  `).run({ id, draftingTimeout: val })
}

export function unsetDraftingTimeout(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_configuration
         SET drafting_timeout = NULL
       WHERE mq_id = $id;
    `).run({ id })
    deleteNoConfigurationsRow(id)
  })()
}

export function setOrderedTimeout(id: string, val: number): void {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (mq_id, ordered_timeout)
    VALUES ($id, $orderedTimeout)
        ON CONFLICT(mq_id)
        DO UPDATE SET ordered_timeout = $orderedTimeout;
  `).run({ id, orderedTimeout: val })
}

export function unsetOrderedTimeout(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_configuration
         SET ordered_timeout = NULL
       WHERE mq_id = $id;
    `).run({ id })
    deleteNoConfigurationsRow(id)
  })()
}

export function setActiveTimeout(id: string, val: number): void {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (mq_id, active_timeout)
    VALUES ($id, $activeTimeout)
        ON CONFLICT(mq_id)
        DO UPDATE SET active_timeout = $activeTimeout;
  `).run({ id, activeTimeout: val })
}

export function unsetActiveTimeout(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_configuration
         SET active_timeout = NULL
       WHERE mq_id = $id;
    `).run({ id })
    deleteNoConfigurationsRow(id)
  })()
}

export function setConcurrency(id: string, val: number): void {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (mq_id, concurrency)
    VALUES ($id, $concurrency)
        ON CONFLICT(mq_id)
        DO UPDATE SET concurrency = $concurrency;
  `).run({ id, concurrency: val })
}

export function unsetConcurrency(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_configuration
         SET concurrency = NULL
       WHERE mq_id = $id;
    `).run({ id })
    deleteNoConfigurationsRow(id)
  })()
}

export function setThrottle(id: string, val: Throttle): void {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (mq_id, throttle_duration, throttle_limit)
    VALUES ($id, $duration, $limit)
        ON CONFLICT(mq_id)
        DO UPDATE SET throttle_duration = $duration
                    , throttle_limit = $limit
  `).run({
    id
  , duration: val.duration
  , limit: val.limit
  })
}

export function unsetThrottle(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_configuration
         SET throttle_duration = NULL
           , throttle_limit = NULL
       WHERE mq_id = $id;
    `).run({ id })
    deleteNoConfigurationsRow(id)
  })()
}

function deleteNoConfigurationsRow(id: string): void {
  getDatabase().prepare(`
    DELETE FROM mq_configuration
     WHERE mq_id = $id
       AND uniq = NULL
       AND drafting_timeout = NULL
       AND ordered_timeout = NULL
       AND active_timeout = NULL
       AND concurrency = NULL
       AND throttle_duration = NULL
       AND throttle_limit = NULL
  `).run({ id })
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
