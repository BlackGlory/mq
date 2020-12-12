import { getDatabase } from '../database'

export function getAllIdsWithJsonSchema(): string[] {
  const result = getDatabase().prepare(`
    SELECT mq_id FROM mq_json_schema
  `).all()
  return result.map(x => x['mq_id'])
}

export function getJsonSchema(id: string): string | null {
  const result = getDatabase().prepare(`
    SELECT json_schema FROM mq_json_schema
     WHERE mq_id = $id;
  `).get({ id })
  if (result) return result['json_schema']
  else return null
}

export function setJsonSchema({ id, schema }: { id: string; schema: string }): void {
  getDatabase().prepare(`
    INSERT INTO mq_json_schema (mq_id, json_schema)
    VALUES ($id, $schema)
        ON CONFLICT(mq_id)
        DO UPDATE SET json_schema = $schema;
  `).run({ id, schema })
}

export function removeJsonSchema(id: string): void {
  getDatabase().prepare(`
    DELETE FROM mq_json_schema
     WHERE mq_id = $id;
  `).run({ id })
}
