import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawBlacklist {
  mq_id: string
}

interface IRawWhitelist {
  mq_id: string
}

interface IRawTokenPolicy {
  mq_id: string
  produce_token_required: number | null
  consume_token_required: number | null
  clear_token_required: number | null
}

interface IRawToken {
  token: string
  mq_id: string
  produce_permission: number
  consume_permission: number
  clear_permission: number
}

export function setRawBlacklist(props: IRawBlacklist): void {
  getDatabase().prepare(`
    INSERT INTO mq_blacklist (mq_id)
    VALUES ($mq_id);
  `).run(props)
}

export function hasRawBlacklist(id: string): boolean {
  return !!getRawBlacklist(id)
}

export function getRawBlacklist(id: string): IRawBlacklist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_blacklist
     WHERE mq_id = $id;
  `).get({ id })
}

export function setRawWhitelist(props: IRawWhitelist): void {
  getDatabase().prepare(`
    INSERT INTO mq_whitelist (mq_id)
    VALUES ($mq_id);
  `).run(props)
}

export function hasRawWhitelist(id: string): boolean {
  return !!getRawWhitelist(id)
}

export function getRawWhitelist(id: string): IRawWhitelist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_whitelist
     WHERE mq_id = $id;
  `).get({ id })
}

export function setRawTokenPolicy(props: IRawTokenPolicy): void {
  getDatabase().prepare(`
    INSERT INTO mq_token_policy (
      mq_id
    , produce_token_required
    , consume_token_required
    , clear_token_required
    )
    VALUES (
      $mq_id
    , $produce_token_required
    , $consume_token_required
    , $clear_token_required
    );
  `).run(props)
}

export function hasRawTokenPolicy(id: string): boolean {
  return !!getRawTokenPolicy(id)
}

export function getRawTokenPolicy(id: string): IRawTokenPolicy | null {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_token_policy
     WHERE mq_id = $id;
  `).get({ id })
}

export function setRawToken(props: IRawToken): void {
  getDatabase().prepare(`
    INSERT INTO mq_token (
      token
    , mq_id
    , produce_permission
    , consume_permission
    , clear_permission
    )
    VALUES (
      $token
    , $mq_id
    , $produce_permission
    , $consume_permission
    , $clear_permission
    );
  `).run(props)
}

export function hasRawToken(token: string, id: string): boolean {
  return !!getRawToken(token, id)
}

export function getRawToken(token: string, id: string): IRawToken | null {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_token
     WHERE token = $token
       AND mq_id = $id;
  `).get({ token, id })
}
