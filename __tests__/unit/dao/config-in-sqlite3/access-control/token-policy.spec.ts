import * as DAO from '@dao/config-in-sqlite3/access-control/token-policy'
import { getDatabase } from '@dao/config-in-sqlite3/database'
import { resetEnvironment, resetDatabases } from '@test/utils'
import { Database } from 'better-sqlite3'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('TokenPolicy', () => {
  describe('getAllIdsWithTokenPolicies(): string[]', () => {
    it('return string[]', async () => {
      const db = getDatabase()
      const id = 'id'
      insert(db, id, {
        produceTokenRequired: 1
      , consumeTokenRequired: 1
      , clearTokenRequired: 1
      })

      const result = DAO.getAllIdsWithTokenPolicies()

      expect(result).toEqual([id])
    })
  })

  describe('getTokenPolicies(id: string): TokenPolicy', () => {
    describe('exists', () => {
      it('return', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, {
          produceTokenRequired: 1
        , consumeTokenRequired: 1
        , clearTokenRequired: 1
        })

        const result = DAO.getTokenPolicies(id)

        expect(result).toEqual({
          produceTokenRequired: true
        , consumeTokenRequired: true
        , clearTokenRequired: true
        })
      })
    })

    describe('does not exist', () => {
      it('return', async () => {
        const id = 'id'

        const result = DAO.getTokenPolicies(id)

        expect(result).toEqual({
          produceTokenRequired: null
        , consumeTokenRequired: null
        , clearTokenRequired: null
        })
      })
    })
  })

  describe('setProduceTokenRequired(id: string, val: boolean): void', () => {
    it('return undefined', async () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setProduceTokenRequired(id, true)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['produce_token_required']).toBe(1)
    })
  })

  describe('unsetProduceTokenRequired(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, {
          consumeTokenRequired: 1
        , produceTokenRequired: 1
        , clearTokenRequired: 1
        })

        const result = DAO.unsetProduceTokenRequired(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['produce_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetProduceTokenRequired(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })

  describe('setConsumeTokenRequired(id: string, val: boolean): void', () => {
    it('return undefined', async () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setConsumeTokenRequired(id, true)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['consume_token_required']).toBe(1)
    })
  })

  describe('unsetConsumeTokenRequired(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, {
          consumeTokenRequired: 1
        , produceTokenRequired: 1
        , clearTokenRequired: 1
        })

        const result = DAO.unsetConsumeTokenRequired(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['consume_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetConsumeTokenRequired(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })

  describe('setClearTokenRequired(id: string, val: boolean): void', () => {
    it('return undefined', async () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setClearTokenRequired(id, true)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['clear_token_required']).toBe(1)
    })
  })

  describe('unsetClearTokenRequired(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, {
          consumeTokenRequired: 1
        , produceTokenRequired: 1
        , clearTokenRequired: 1
        })

        const result = DAO.unsetClearTokenRequired(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['clear_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetClearTokenRequired(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })
})

function exist(db: Database, id: string) {
  return !!select(db, id)
}

function select(db: Database, id: string) {
  return db.prepare(`
    SELECT *
      FROM mq_token_policy
     WHERE mq_id = $id;
  `).get({ id })
}

function insert(
  db: Database
, id: string
, { produceTokenRequired, consumeTokenRequired, clearTokenRequired }: {
    produceTokenRequired: number | null
    consumeTokenRequired: number | null
    clearTokenRequired: number | null
  }
) {
  db.prepare(`
    INSERT INTO mq_token_policy (
      mq_id
    , produce_token_required
    , consume_token_required
    , clear_token_required
    )
    VALUES (
      $id
    , $produceTokenRequired
    , $consumeTokenRequired
    , $clearTokenRequired
    );
  `).run({
    id
  , produceTokenRequired
  , consumeTokenRequired
  , clearTokenRequired
  })
}
