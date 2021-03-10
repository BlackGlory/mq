import * as DAO from '@dao/config-in-sqlite3/access-control/token-policy'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getRawTokenPolicy, hasRawTokenPolicy, setRawTokenPolicy } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('TokenPolicy', () => {
  describe('getAllIdsWithTokenPolicies(): string[]', () => {
    it('return string[]', () => {
      const id = 'id'
      setRawTokenPolicy({
        mq_id: id
      , produce_token_required: 1
      , consume_token_required: 1
      , clear_token_required: 1
      })

      const result = DAO.getAllIdsWithTokenPolicies()

      expect(result).toEqual([id])
    })
  })

  describe('getTokenPolicies(id: string): TokenPolicy', () => {
    describe('exists', () => {
      it('return', () => {
        const id = 'id'
        setRawTokenPolicy({
          mq_id: id
        , produce_token_required: 1
        , consume_token_required: 1
        , clear_token_required: 1
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
      const row = getRawTokenPolicy(id)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['produce_token_required']).toBe(1)
    })
  })

  describe('unsetProduceTokenRequired(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setRawTokenPolicy({
          mq_id: id
        , consume_token_required: 1
        , produce_token_required: 1
        , clear_token_required: 1
        })

        const result = DAO.unsetProduceTokenRequired(id)
        const row = getRawTokenPolicy(id)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['produce_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetProduceTokenRequired(id)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(id)).toBeFalse()
      })
    })
  })

  describe('setConsumeTokenRequired(id: string, val: boolean): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setConsumeTokenRequired(id, true)
      const row = getRawTokenPolicy(id)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['consume_token_required']).toBe(1)
    })
  })

  describe('unsetConsumeTokenRequired(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setRawTokenPolicy({
          mq_id: id
        , consume_token_required: 1
        , produce_token_required: 1
        , clear_token_required: 1
        })

        const result = DAO.unsetConsumeTokenRequired(id)
        const row = getRawTokenPolicy(id)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['consume_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetConsumeTokenRequired(id)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(id)).toBeFalse()
      })
    })
  })

  describe('setClearTokenRequired(id: string, val: boolean): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setClearTokenRequired(id, true)
      const row = getRawTokenPolicy(id)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['clear_token_required']).toBe(1)
    })
  })

  describe('unsetClearTokenRequired(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setRawTokenPolicy({
          mq_id: id
        , consume_token_required: 1
        , produce_token_required: 1
        , clear_token_required: 1
        })

        const result = DAO.unsetClearTokenRequired(id)
        const row = getRawTokenPolicy(id)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['clear_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetClearTokenRequired(id)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(id)).toBeFalse()
      })
    })
  })
})
