import { getDatabase } from '../database'

export function getAllWhitelistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT mq_id FROM mq_whitelist;
  `).all()
  return result.map(x => x['mq_id'])
}

export function inWhitelist(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_whitelist
              WHERE mq_id = $id
           ) AS exist_in_whitelist;
  `).get({ id })
  return result['exist_in_whitelist'] === 1
}

export function addWhitelistItem(id: string) {
  try {
    getDatabase().prepare(`
      INSERT INTO mq_whitelist (mq_id)
      VALUES ($id);
    `).run({ id })
  } catch {}
}

export function removeWhitelistItem(id: string) {
  getDatabase().prepare(`
    DELETE FROM mq_whitelist
     WHERE mq_id = $id;
  `).run({ id })
}
