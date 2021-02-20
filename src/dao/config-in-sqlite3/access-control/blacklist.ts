import { getDatabase } from '../database'

export function getAllBlacklistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT mq_id
      FROM mq_blacklist;
  `).all()

  return result.map(x => x['mq_id'])
}

export function inBlacklist(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mq_blacklist
              WHERE mq_id = $id
           ) AS exist_in_blacklist;
  `).get({ id })

  return result['exist_in_blacklist'] === 1
}

export function addBlacklistItem(id: string) {
  getDatabase().prepare(`
    INSERT INTO mq_blacklist (mq_id)
    VALUES ($id)
        ON CONFLICT
        DO NOTHING;
  `).run({ id })
}

export function removeBlacklistItem(id: string) {
  getDatabase().prepare(`
    DELETE FROM mq_blacklist
     WHERE mq_id = $id;
  `).run({ id })
}
