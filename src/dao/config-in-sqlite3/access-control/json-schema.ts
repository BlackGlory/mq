import { getDatabase } from '../database'

export function getAllIdsWithJsonSchema(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM mq_json_schema
  `).all()

  return result.map(x => x['namespace'])
}

export function getJsonSchema(namespace: string): string | null {
  const result = getDatabase().prepare(`
    SELECT json_schema
      FROM mq_json_schema
     WHERE namespace = $namespace;
  `).get({ namespace })

  return result ? result['json_schema'] : null
}

export function setJsonSchema({ namespace, schema }: {
  namespace: string
  schema: string
}): void {
  getDatabase().prepare(`
    INSERT INTO mq_json_schema (namespace, json_schema)
    VALUES ($namespace, $schema)
        ON CONFLICT(namespace)
        DO UPDATE SET json_schema = $schema;
  `).run({ namespace, schema })
}

export function removeJsonSchema(namespace: string): void {
  getDatabase().prepare(`
    DELETE FROM mq_json_schema
     WHERE namespace = $namespace;
  `).run({ namespace })
}
