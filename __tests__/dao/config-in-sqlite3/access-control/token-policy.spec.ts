import * as DAO from '@dao/config-in-sqlite3/access-control/token-policy'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getRawTokenPolicy, hasRawTokenPolicy, setRawTokenPolicy } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('TokenPolicy', () => {
  describe('getAllNamespacesWithTokenPolicies(): string[]', () => {
    it('return string[]', () => {
      const namespace = 'namespace'
      setRawTokenPolicy({
        namespace
      , produce_token_required: 1
      , consume_token_required: 1
      , clear_token_required: 1
      })

      const result = DAO.getAllIdsWithTokenPolicies()

      expect(result).toEqual([namespace])
    })
  })

  describe('getTokenPolicies(namespace: string): TokenPolicy', () => {
    describe('exists', () => {
      it('return', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , produce_token_required: 1
        , consume_token_required: 1
        , clear_token_required: 1
        })

        const result = DAO.getTokenPolicies(namespace)

        expect(result).toEqual({
          produceTokenRequired: true
        , consumeTokenRequired: true
        , clearTokenRequired: true
        })
      })
    })

    describe('does not exist', () => {
      it('return', () => {
        const namespace = 'namespace'

        const result = DAO.getTokenPolicies(namespace)

        expect(result).toEqual({
          produceTokenRequired: null
        , consumeTokenRequired: null
        , clearTokenRequired: null
        })
      })
    })
  })

  describe('setProduceTokenRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setProduceTokenRequired(namespace, true)
      const row = getRawTokenPolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['produce_token_required']).toBe(1)
    })
  })

  describe('unsetProduceTokenRequired(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , consume_token_required: 1
        , produce_token_required: 1
        , clear_token_required: 1
        })

        const result = DAO.unsetProduceTokenRequired(namespace)
        const row = getRawTokenPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['produce_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetProduceTokenRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(namespace)).toBeFalse()
      })
    })
  })

  describe('setConsumeTokenRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setConsumeTokenRequired(namespace, true)
      const row = getRawTokenPolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['consume_token_required']).toBe(1)
    })
  })

  describe('unsetConsumeTokenRequired(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , consume_token_required: 1
        , produce_token_required: 1
        , clear_token_required: 1
        })

        const result = DAO.unsetConsumeTokenRequired(namespace)
        const row = getRawTokenPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['consume_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetConsumeTokenRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(namespace)).toBeFalse()
      })
    })
  })

  describe('setClearTokenRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setClearTokenRequired(namespace, true)
      const row = getRawTokenPolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['clear_token_required']).toBe(1)
    })
  })

  describe('unsetClearTokenRequired(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , consume_token_required: 1
        , produce_token_required: 1
        , clear_token_required: 1
        })

        const result = DAO.unsetClearTokenRequired(namespace)
        const row = getRawTokenPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['clear_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetClearTokenRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(namespace)).toBeFalse()
      })
    })
  })
})
