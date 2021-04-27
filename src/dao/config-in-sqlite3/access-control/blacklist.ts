import { getDatabase } from '../database'

export function getAllBlacklistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM mq_blacklist;
  `).all()

  return result.map(x => x['namespace'])
}

export function inBlacklist(namespace: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM mq_blacklist
              WHERE namespace = $namespace
           ) AS exist_in_blacklist;
  `).get({ namespace })

  return result['exist_in_blacklist'] === 1
}

export function addBlacklistItem(namespace: string) {
  getDatabase().prepare(`
    INSERT INTO mq_blacklist (namespace)
    VALUES ($namespace)
        ON CONFLICT
        DO NOTHING;
  `).run({ namespace })
}

export function removeBlacklistItem(namespace: string) {
  getDatabase().prepare(`
    DELETE FROM mq_blacklist
     WHERE namespace = $namespace;
  `).run({ namespace })
}
