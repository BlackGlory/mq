import { getDatabase } from '../database'

export function getAllIdsWithTokens(): string[] {
  const result = getDatabase().prepare(`
    SELECT mq_id
      FROM mq_token;
  `).all()
  return result.map(x => x['mq_id'])
}

export function getAllTokens(id: string): Array<ITokenInfo> {
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
     WHERE mq_id = $id;
  `).all({ id })
  return result.map(x => ({
    token: x['token']
  , produce: x['produce_permission'] === 1
  , consume: x['consume_permission'] === 1
  , clear: x['clear_permission'] === 1
  }))
}

export function hasProduceTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE mq_id = $id
                AND produce_permission = 1
           ) AS produce_tokens_exist;
  `).get({ id })
  return result['produce_tokens_exist'] === 1
}

export function matchProduceToken(params: { token: string; id: string }): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE mq_id = $id
                AND token = $token
                AND produce_permission = 1
           ) AS matched;
  `).get(params)
  return result['matched'] === 1
}

export function setProduceToken(params: { token: string; id: string }) {
  getDatabase().prepare(`
    INSERT INTO mq_token (token, mq_id, produce_permission)
    VALUES ($token, $id, 1)
        ON CONFLICT (token, mq_id)
        DO UPDATE SET produce_permission = 1;
  `).run(params)
}

export function unsetProduceToken(params: { token: string; id: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_token
         SET produce_permission = 0
       WHERE token = $token
         AND mq_id = $id;
    `).run(params)
    clearNoPermissionToken(params)
  })()
}

export function hasConsumeTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE mq_id = $id
                AND consume_permission = 1
           ) AS consume_tokens_exist
  `).get({ id })
  return result['consume_tokens_exist'] === 1
}

export function matchConsumeToken(params: { token: string; id: string }): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE mq_id = $id
                AND token = $token
                AND consume_permission = 1
           ) AS matched
  `).get(params)
  return result['matched'] === 1
}

export function setConsumeToken(params: { token: string; id: string }) {
  getDatabase().prepare(`
    INSERT INTO mq_token (token, mq_id, consume_permission)
    VALUES ($token, $id, 1)
        ON CONFLICT (token, mq_id)
        DO UPDATE SET consume_permission = 1;
  `).run(params)
}

export function unsetConsumeToken(params: { token: string; id: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_token
         SET consume_permission = 0
       WHERE token = $token
         AND mq_id = $id;
    `).run(params)
    clearNoPermissionToken(params)
  })()
}

export function matchClearToken(params: { token: string; id: string }): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_token
              WHERE mq_id = $id
                AND token = $token
                AND clear_permission = 1
           ) AS matched
  `).get(params)
  return result['matched'] === 1
}

export function setClearToken(params: { token: string; id: string }) {
  getDatabase().prepare(`
    INSERT INTO mq_token (token, mq_id, clear_permission)
    VALUES ($token, $id, 1)
        ON CONFLICT (token, mq_id)
        DO UPDATE SET clear_permission = 1;
  `).run(params)
}

export function unsetClearToken(params: { token: string; id: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mq_token
         SET clear_permission = 0
       WHERE token = $token
         AND mq_id = $id;
    `).run(params)
    clearNoPermissionToken(params)
  })()
}

function clearNoPermissionToken(params: { token: string, id: string }) {
  getDatabase().prepare(`
    DELETE FROM mq_token
     WHERE token = $token
       AND mq_id = $id
       AND produce_permission = 0
       AND consume_permission = 0
       AND clear_permission = 0;
  `).run(params)
}
