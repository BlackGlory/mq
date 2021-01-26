import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawConfiguration {
  mq_id: string
  uniq: number | null
  drafting_timeout: number | null
  ordered_timeout: number | null
  active_timeout: number | null
  concurrency: number | null
  throttle_duration: number | null
  throttle_limit: number | null
}

export function setRawConfiguration(props: IRawConfiguration): void {
  getDatabase().prepare(`
    INSERT INTO mq_configuration (
      mq_id
    , uniq
    , drafting_timeout
    , ordered_timeout
    , active_timeout
    , concurrency
    , throttle_duration
    , throttle_limit
    )
    VALUES (
      $mq_id
    , $uniq
    , $drafting_timeout
    , $ordered_timeout
    , $active_timeout
    , $concurrency
    , $throttle_duration
    , $throttle_limit
    );
  `).run(props)
}

export function hasRawConfiguration(id: string): boolean {
  return !!getRawConfiguration(id)
}

export function getRawConfiguration(id: string): IRawConfiguration | null {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_configuration
     WHERE mq_id = $id;
  `).get({ id })
}
