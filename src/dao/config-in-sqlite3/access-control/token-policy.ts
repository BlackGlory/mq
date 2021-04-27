import { getDatabase } from '../database'

export function getAllIdsWithTokenPolicies(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM mq_token_policy;
  `).all()
  return result.map(x => x['namespace'])
}

export function getTokenPolicies(namespace: string): ITokenPolicy {
  const row: {
    'produce_token_required': number | null
  , 'consume_token_required': number | null
  , 'clear_token_required': number | null
  } = getDatabase().prepare(`
    SELECT produce_token_required
         , consume_token_required
         , clear_token_required
      FROM mq_token_policy
     WHERE namespace = $namespace;
  `).get({ namespace })
  if (row) {
    const produceTokenRequired = row['produce_token_required']
    const consumeTokenRequired = row['consume_token_required']
    const clearTokenRequired = row['clear_token_required']
    return {
      produceTokenRequired:
        produceTokenRequired === null
        ? null
        : numberToBoolean(produceTokenRequired)
    , consumeTokenRequired:
        consumeTokenRequired === null
        ? null
        : numberToBoolean(consumeTokenRequired)
    , clearTokenRequired:
        clearTokenRequired === null
        ? null
        : numberToBoolean(clearTokenRequired)
    }
  } else {
    return {
      produceTokenRequired: null
    , consumeTokenRequired: null
    , clearTokenRequired: null
    }
  }
}

export function setProduceTokenRequired(namespace: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO mq_token_policy (namespace, produce_token_required)
    VALUES ($namespace, $produceTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET produce_token_required = $produceTokenRequired;
  `).run({ namespace, produceTokenRequired: booleanToNumber(val) })
}

export function unsetProduceTokenRequired(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_token_policy
         SET produce_token_required = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoPoliciesRow(namespace)
  })()
}

export function setConsumeTokenRequired(namespace: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO mq_token_policy (namespace, consume_token_required)
    VALUES ($namespace, $consumeTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET consume_token_required = $consumeTokenRequired;
  `).run({ namespace, consumeTokenRequired: booleanToNumber(val) })
}

export function unsetConsumeTokenRequired(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_token_policy
         SET consume_token_required = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoPoliciesRow(namespace)
  })()
}

export function setClearTokenRequired(namespace: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO mq_token_policy (namespace, clear_token_required)
    VALUES ($namespace, $clearTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET clear_token_required = $clearTokenRequired;
  `).run({ namespace, clearTokenRequired: booleanToNumber(val) })
}

export function unsetClearTokenRequired(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_token_policy
         SET clear_token_required = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoPoliciesRow(namespace)
  })()
}

function deleteNoPoliciesRow(namespace: string): void {
  getDatabase().prepare(`
    DELETE FROM mq_token_policy
     WHERE namespace = $namespace
       AND produce_token_required = NULL
       AND consume_token_required = NULL
       AND clear_token_required = NULL
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
