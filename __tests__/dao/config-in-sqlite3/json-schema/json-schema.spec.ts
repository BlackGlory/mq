import * as DAO from '@dao/config-in-sqlite3/json-schema/json-schema'
import { getDatabase } from '@dao/config-in-sqlite3/database'
import { resetDatabases, resetEnvironment } from '@test/utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('JSON Schema', () => {
  describe('getAllIdsWithJsonSchema(): string[]', () => {
    it('return string[]', () => {
      const id = 'id-1'
      const schema = createSchema()
      insert({ id, schema })

      const result = DAO.getAllIdsWithJsonSchema()

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([id])
    })
  })

  describe('getJsonSchema(id: string): string | null', () => {
    describe('exist', () => {
      it('return schema', () => {
        const id = 'id-1'
        const schema = createSchema()
        insert({ id, schema })

        const result = DAO.getJsonSchema(id)

        expect(result).toBe(schema)
      })
    })

    describe('not exist', () => {
      it('return null', () => {
        const id = 'id-1'

        const result = DAO.getJsonSchema(id)

        expect(result).toBeNull()
      })
    })
  })

  describe('setJsonSchema({ id: string; schema: string })', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const id = 'id-1'
        const schema = createSchema()
        insert({ id, schema })

        const result = DAO.setJsonSchema({ id, schema })

        expect(result).toBeUndefined()
        expect(exist(id)).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const id = 'id-1'
        const schema = createSchema()

        const result = DAO.setJsonSchema({ id, schema })

        expect(result).toBeUndefined()
        expect(exist(id)).toBeTrue()
      })
    })
  })

  describe('removeJsonSchema(id: string)', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const id = 'id-1'
        const schema = createSchema()
        insert({ id, schema })

        const result = DAO.removeJsonSchema(id)

        expect(result).toBeUndefined()
        expect(exist(id)).toBeFalse()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const id = 'id-1'

        const result = DAO.removeJsonSchema(id)

        expect(result).toBeUndefined()
        expect(exist(id)).toBeFalse()
      })
    })
  })
})

function createSchema() {
  return JSON.stringify({ type: 'number' })
}

function exist(id: string): boolean {
  return !!select(id)
}

function insert({ id, schema }:{ id: string; schema: string }): void {
  getDatabase().prepare('INSERT INTO mq_json_schema (mq_id, json_schema) VALUES ($id, $schema);').run({ id, schema })
}

function select(id: string) {
  return getDatabase().prepare('SELECT * FROM mq_json_schema WHERE mq_id = $id;').get({ id })
}
