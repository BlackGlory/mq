import { getDatabase } from '@dao/config/database.js'

interface IRawBlacklist {
  namespace: string
}

interface IRawWhitelist {
  namespace: string
}

interface IRawTokenPolicy {
  namespace: string
  produce_token_required: number | null
  consume_token_required: number | null
  clear_token_required: number | null
}

interface IRawToken {
  token: string
  namespace: string
  produce_permission: number
  consume_permission: number
  clear_permission: number
}

export function setRawBlacklist(raw: IRawBlacklist): IRawBlacklist {
  getDatabase().prepare(`
    INSERT INTO mq_blacklist (namespace)
    VALUES ($namespace);
  `).run(raw)

  return raw
}

export function hasRawBlacklist(namespace: string): boolean {
  return !!getRawBlacklist(namespace)
}

export function getRawBlacklist(namespace: string): IRawBlacklist | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_blacklist
     WHERE namespace = $namespace;
  `).get({ namespace }) as IRawBlacklist | undefined
}

export function setRawWhitelist(raw: IRawWhitelist): IRawWhitelist {
  getDatabase().prepare(`
    INSERT INTO mq_whitelist (namespace)
    VALUES ($namespace);
  `).run(raw)

  return raw
}

export function hasRawWhitelist(namespace: string): boolean {
  return !!getRawWhitelist(namespace)
}

export function getRawWhitelist(namespace: string): IRawWhitelist | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_whitelist
     WHERE namespace = $namespace;
  `).get({ namespace }) as IRawWhitelist | undefined
}

export function setRawTokenPolicy<T extends IRawTokenPolicy>(raw: T): T {
  getDatabase().prepare(`
    INSERT INTO mq_token_policy (
      namespace
    , produce_token_required
    , consume_token_required
    , clear_token_required
    )
    VALUES (
      $namespace
    , $produce_token_required
    , $consume_token_required
    , $clear_token_required
    );
  `).run(raw)

  return raw
}

export function hasRawTokenPolicy(namespace: string): boolean {
  return !!getRawTokenPolicy(namespace)
}

export function getRawTokenPolicy(namespace: string): IRawTokenPolicy | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_token_policy
     WHERE namespace = $namespace;
  `).get({ namespace }) as IRawTokenPolicy | undefined
}

export function setRawToken(raw: IRawToken): IRawToken {
  getDatabase().prepare(`
    INSERT INTO mq_token (
      token
    , namespace
    , produce_permission
    , consume_permission
    , clear_permission
    )
    VALUES (
      $token
    , $namespace
    , $produce_permission
    , $consume_permission
    , $clear_permission
    );
  `).run(raw)

  return raw
}

export function hasRawToken(token: string, namespace: string): boolean {
  return !!getRawToken(token, namespace)
}

export function getRawToken(token: string, namespace: string): IRawToken | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_token
     WHERE token = $token
       AND namespace = $namespace;
  `).get({ token, namespace }) as IRawToken | undefined
}
