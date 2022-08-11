import { getDatabase } from '../database'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllIdsWithTokenPolicies = withLazyStatic(function (): string[] {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM mq_token_policy;
  `), [getDatabase()]).all()

  return result.map(x => x['namespace'])
})

export const getTokenPolicies = withLazyStatic(function (namespace: string): ITokenPolicy {
  const row: {
    'produce_token_required': number | null
  , 'consume_token_required': number | null
  , 'clear_token_required': number | null
  } = lazyStatic(() => getDatabase().prepare(`
    SELECT produce_token_required
         , consume_token_required
         , clear_token_required
      FROM mq_token_policy
     WHERE namespace = $namespace;
  `), [getDatabase()]).get({ namespace })
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
})

export const setProduceTokenRequired = withLazyStatic(function (
  namespace: string
, val: boolean
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_token_policy (namespace, produce_token_required)
    VALUES ($namespace, $produceTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET produce_token_required = $produceTokenRequired;
  `), [getDatabase()]).run({ namespace, produceTokenRequired: booleanToNumber(val) })
})

export const unsetProduceTokenRequired = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_token_policy
         SET produce_token_required = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoPoliciesRow(namespace)
  }), [getDatabase()])(namespace)
})

export const setConsumeTokenRequired = withLazyStatic(function (
  namespace: string
, val: boolean
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_token_policy (namespace, consume_token_required)
    VALUES ($namespace, $consumeTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET consume_token_required = $consumeTokenRequired;
  `), [getDatabase()]).run({ namespace, consumeTokenRequired: booleanToNumber(val) })
})

export const unsetConsumeTokenRequired = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_token_policy
         SET consume_token_required = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoPoliciesRow(namespace)
  }), [getDatabase()])(namespace)
})

export const setClearTokenRequired = withLazyStatic(function (
  namespace: string
, val: boolean
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO mq_token_policy (namespace, clear_token_required)
    VALUES ($namespace, $clearTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET clear_token_required = $clearTokenRequired;
  `), [getDatabase()]).run({ namespace, clearTokenRequired: booleanToNumber(val) })
})

export const unsetClearTokenRequired = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE mq_token_policy
         SET clear_token_required = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoPoliciesRow(namespace)
  }), [getDatabase()])(namespace)
})

const deleteNoPoliciesRow = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM mq_token_policy
     WHERE namespace = $namespace
       AND produce_token_required = NULL
       AND consume_token_required = NULL
       AND clear_token_required = NULL
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
