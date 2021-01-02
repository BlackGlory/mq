import * as DAO from '@dao/config-in-sqlite3/access-control/token-policy'
import { getDatabase } from '@dao/config-in-sqlite3/database'
import { resetEnvironment, resetDatabases } from '@test/utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('TokenPolicy', () => {
  describe('getAllIdsWithTokenPolicies(): string[]', () => {
    it('return string[]', () => {
      const id = 'id'
      insert(id, {
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
      it('return', () => {
        const id = 'id'
        insert(id, {
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
      it('return', () => {
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
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setProduceTokenRequired(id, true)
      const row = select(id)

      expect(result).toBeUndefined()
      expect(row['produce_token_required']).toBe(1)
    })
  })

  describe('unsetProduceTokenRequired(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        insert(id, {
          consumeTokenRequired: 1
        , produceTokenRequired: 1
        , clearTokenRequired: 1
        })

        const result = DAO.unsetProduceTokenRequired(id)
        const row = select(id)

        expect(result).toBeUndefined()
        expect(row['produce_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetProduceTokenRequired(id)

        expect(result).toBeUndefined()
        expect(exist(id)).toBeFalse()
      })
    })
  })

  describe('setConsumeTokenRequired(id: string, val: boolean): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setConsumeTokenRequired(id, true)
      const row = select(id)

      expect(result).toBeUndefined()
      expect(row['consume_token_required']).toBe(1)
    })
  })

  describe('unsetConsumeTokenRequired(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        insert(id, {
          consumeTokenRequired: 1
        , produceTokenRequired: 1
        , clearTokenRequired: 1
        })

        const result = DAO.unsetConsumeTokenRequired(id)
        const row = select(id)

        expect(result).toBeUndefined()
        expect(row['consume_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetConsumeTokenRequired(id)

        expect(result).toBeUndefined()
        expect(exist(id)).toBeFalse()
      })
    })
  })

  describe('setClearTokenRequired(id: string, val: boolean): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setClearTokenRequired(id, true)
      const row = select(id)

      expect(result).toBeUndefined()
      expect(row['clear_token_required']).toBe(1)
    })
  })

  describe('unsetClearTokenRequired(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        insert(id, {
          consumeTokenRequired: 1
        , produceTokenRequired: 1
        , clearTokenRequired: 1
        })

        const result = DAO.unsetClearTokenRequired(id)
        const row = select(id)

        expect(result).toBeUndefined()
        expect(row['clear_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetClearTokenRequired(id)

        expect(result).toBeUndefined()
        expect(exist(id)).toBeFalse()
      })
    })
  })
})

function exist(id: string): boolean {
  return !!select(id)
}

function select(id: string) {
  return getDatabase().prepare(`
    SELECT *
      FROM mq_token_policy
     WHERE mq_id = $id;
  `).get({ id })
}

function insert(
  id: string
, { produceTokenRequired, consumeTokenRequired, clearTokenRequired }: {
    produceTokenRequired: number | null
    consumeTokenRequired: number | null
    clearTokenRequired: number | null
  }
): void {
  getDatabase().prepare(`
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
