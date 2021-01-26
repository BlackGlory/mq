import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawJsonSchema {
  mq_id: string
  json_schema: string
}

export function setRawJsonSchema(props: IRawJsonSchema): void {
  getDatabase().prepare(`
    INSERT INTO mq_json_schema (mq_id, json_schema)
    VALUES ($mq_id, $json_schema);
  `).run(props)
}

export function hasRawJsonSchema(id: string): boolean {
  return !!getRawJsonSchema(id)
}

export function getRawJsonSchema(id: string): IRawJsonSchema | null {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_json_schema
     WHERE mq_id = $id;
  `).get({ id })
}
