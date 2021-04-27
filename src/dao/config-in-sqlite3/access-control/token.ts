import { getDatabase } from '../database'

export function getAllIdsWithTokens(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM mq_token;
  `).all()
  return result.map(x => x['namespace'])
}

export function getAllTokens(namespace: string): Array<ITokenInfo> {
  const result: Array<{
    token: string
    'produce_permission': number
    'consume_permission': number
    'clear_permission': number
  }> = getDatabase().prepare(`
    SELECT token
         , produce_permission
         , consume_permission
         , clear_permission
      FROM mq_token
     WHERE namespace = $namespace;
  `).all({ namespace })

  return result.map(x => ({
    token: x['token']
  , produce: x['produce_permission'] === 1
  , consume: x['consume_permission'] === 1
  , clear: x['clear_permission'] === 1
  }))
}

export function hasProduceTokens(namespace: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE namespace = $namespace
                AND produce_permission = 1
           ) AS produce_tokens_exist;
  `).get({ namespace })

  return result['produce_tokens_exist'] === 1
}

export function matchProduceToken(params: { token: string; namespace: string }): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE namespace = $namespace
                AND token = $token
                AND produce_permission = 1
           ) AS matched;
  `).get(params)

  return result['matched'] === 1
}

export function setProduceToken(params: { token: string; namespace: string }) {
  getDatabase().prepare(`
    INSERT INTO mq_token (token, namespace, produce_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET produce_permission = 1;
  `).run(params)
}

export function unsetProduceToken(params: { token: string; namespace: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_token
         SET produce_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `).run(params)

    deleteNoPermissionToken(params)
  })()
}

export function hasConsumeTokens(namespace: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE namespace = $namespace
                AND consume_permission = 1
           ) AS consume_tokens_exist
  `).get({ namespace })

  return result['consume_tokens_exist'] === 1
}

export function matchConsumeToken(params: { token: string; namespace: string }): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE namespace = $namespace
                AND token = $token
                AND consume_permission = 1
           ) AS matched
  `).get(params)

  return result['matched'] === 1
}

export function setConsumeToken(params: { token: string; namespace: string }) {
  getDatabase().prepare(`
    INSERT INTO mq_token (token, namespace, consume_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET consume_permission = 1;
  `).run(params)
}

export function unsetConsumeToken(params: { token: string; namespace: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_token
         SET consume_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `).run(params)

    deleteNoPermissionToken(params)
  })()
}

export function matchClearToken(params: { token: string; namespace: string }): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE namespace = $namespace
                AND token = $token
                AND clear_permission = 1
           ) AS matched
  `).get(params)

  return result['matched'] === 1
}

export function setClearToken(params: { token: string; namespace: string }) {
  getDatabase().prepare(`
    INSERT INTO mq_token (token, namespace, clear_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET clear_permission = 1;
  `).run(params)
}

export function unsetClearToken(params: { token: string; namespace: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_token
         SET clear_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `).run(params)

    deleteNoPermissionToken(params)
  })()
}

function deleteNoPermissionToken(params: { token: string, namespace: string }) {
  getDatabase().prepare(`
    DELETE FROM mq_token
     WHERE token = $token
       AND namespace = $namespace
       AND produce_permission = 0
       AND consume_permission = 0
       AND clear_permission = 0;
  `).run(params)
}
