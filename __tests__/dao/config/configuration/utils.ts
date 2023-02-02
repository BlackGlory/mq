import { MapNullablePropsToOptional } from 'hotypes'
import { getDatabase } from '@dao/config/database.js'

interface IRawConfiguration {
  namespace: string
  uniq: number | null
  drafting_timeout: number | null
  ordered_timeout: number | null
  active_timeout: number | null
  concurrency: number | null
}

export function setRawConfiguration<T extends IRawConfiguration>(raw: T): T {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (
      namespace
    , uniq
    , drafting_timeout
    , ordered_timeout
    , active_timeout
    , concurrency
    )
    VALUES (
      $namespace
    , $uniq
    , $drafting_timeout
    , $ordered_timeout
    , $active_timeout
    , $concurrency
    );
  `).run(raw)

  return raw
}

export function setMinimalConfiguration(
  raw: MapNullablePropsToOptional<IRawConfiguration>
): IRawConfiguration {
  return setRawConfiguration({
    namespace: raw.namespace
  , drafting_timeout: raw.drafting_timeout ?? null
  , ordered_timeout: raw.ordered_timeout ?? null
  , active_timeout: raw.active_timeout ?? null
  , concurrency: raw.concurrency ?? null
  , uniq: raw.uniq ?? null
  })
}

export function hasRawConfiguration(namespace: string): boolean {
  return !!getRawConfiguration(namespace)
}

export function getRawConfiguration(namespace: string): IRawConfiguration | null {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_configuration
     WHERE namespace = $namespace;
  `).get({ namespace })
}
