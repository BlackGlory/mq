import { getDatabase } from '../database'

export function getAllIdsWithTokenPolicies(): string[] {
  const result = getDatabase().prepare(`
    SELECT mq_id
      FROM mq_token_policy;
  `).all()
  return result.map(x => x['mq_id'])
}

export function getTokenPolicies(id: string): ITokenPolicy {
  const row: {
    'produce_token_required': number | null
  , 'consume_token_required': number | null
  , 'clear_token_required': number | null
  } = getDatabase().prepare(`
    SELECT produce_token_required
         , consume_token_required
         , clear_token_required
      FROM mq_token_policy
     WHERE mq_id = $id;
  `).get({ id })
  if (row) {
    const produceTokenRequired = row['produce_token_required']
    const consumeTokenRequired = row['consume_token_required']
    const clearTokenRequired = row['clear_token_required']
    return {
      produceTokenRequired: produceTokenRequired === null
                            ? null
                            : numberToBoolean(produceTokenRequired)
    , consumeTokenRequired: consumeTokenRequired === null
                            ? null
                            : numberToBoolean(consumeTokenRequired)
    , clearTokenRequired: clearTokenRequired === null
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

export function setProduceTokenRequired(id: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO mq_token_policy (mq_id, produce_token_required)
    VALUES ($id, $produceTokenRequired)
        ON CONFLICT(mq_id)
        DO UPDATE SET produce_token_required = $produceTokenRequired;
  `).run({ id, produceTokenRequired: booleanToNumber(val) })
}

export function unsetProduceTokenRequired(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_token_policy
         SET produce_token_required = NULL
       WHERE mq_id = $id;
    `).run({ id })

    deleteNoPoliciesRow(id)
  })()
}

export function setConsumeTokenRequired(id: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO mq_token_policy (mq_id, consume_token_required)
    VALUES ($id, $consumeTokenRequired)
        ON CONFLICT(mq_id)
        DO UPDATE SET consume_token_required = $consumeTokenRequired;
  `).run({ id, consumeTokenRequired: booleanToNumber(val) })
}

export function unsetConsumeTokenRequired(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_token_policy
         SET consume_token_required = NULL
       WHERE mq_id = $id;
    `).run({ id })

    deleteNoPoliciesRow(id)
  })()
}

export function setClearTokenRequired(id: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO mq_token_policy (mq_id, clear_token_required)
    VALUES ($id, $clearTokenRequired)
        ON CONFLICT(mq_id)
        DO UPDATE SET clear_token_required = $clearTokenRequired;
  `).run({ id, clearTokenRequired: booleanToNumber(val) })
}

export function unsetClearTokenRequired(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_token_policy
         SET clear_token_required = NULL
       WHERE mq_id = $id;
    `).run({ id })

    deleteNoPoliciesRow(id)
  })()
}

function deleteNoPoliciesRow(id: string): void {
  getDatabase().prepare(`
    DELETE FROM mq_token_policy
     WHERE mq_id = $id
       AND produce_token_required = NULL
       AND consume_token_required = NULL
       AND clear_token_required = NULL
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
