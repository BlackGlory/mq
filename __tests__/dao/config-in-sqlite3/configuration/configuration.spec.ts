import * as DAO from '@dao/config-in-sqlite3/configuration/configuration'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setMinimalConfiguration, getRawConfiguration, hasRawConfiguration } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('Configuration', () => {
  describe('getAllIdsWithConfiguration(): string[]', () => {
    it('return string[]', () => {
      const namespace = 'namespace'
      setMinimalConfiguration({
        namespace
      , uniq: 1
      })

      const result = DAO.getAllIdsWithConfiguration()

      expect(result).toEqual([namespace])
    })
  })

  describe('getConfiguration(namespace: string): Configuration', () => {
    describe('exists', () => {
      it('return', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace
        , uniq: 1
        })

        const result = DAO.getConfiguration(namespace)

        expect(result).toEqual({
          unique: true
        , draftingTimeout: null
        , orderedTimeout: null
        , activeTimeout: null
        , concurrency: null
        , throttle: null
        })
      })
    })

    describe('does not exist', () => {
      it('return', () => {
        const namespace = 'namespace'

        const result = DAO.getConfiguration(namespace)

        expect(result).toEqual({
          unique: null
        , draftingTimeout: null
        , orderedTimeout: null
        , activeTimeout: null
        , concurrency: null
        , throttle: null
        })
      })
    })
  })

  describe('setUnique(namespace: string, val: boolean): vonamespace', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setUnique(namespace, true)
      const row = getRawConfiguration(namespace)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ uniq: 1 })
    })
  })

  describe('unsetUnique(namespace: string): vonamespace', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace
        , drafting_timeout: 100
        })

        const result = DAO.unsetUnique(namespace)
        const row = getRawConfiguration(namespace)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ uniq: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetUnique(namespace)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(namespace)).toBeFalse()
      })
    })
  })

  describe('setDraftingTimeout(namespace: string, val: number): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setDraftingTimeout(namespace, 100)
      const row = getRawConfiguration(namespace)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ drafting_timeout: 100 })
    })
  })

  describe('unsetDraftingTimeout(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace
        , drafting_timeout: 100
        })

        const result = DAO.unsetDraftingTimeout(namespace)
        const row = getRawConfiguration(namespace)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ drafting_timeout: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetDraftingTimeout(namespace)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(namespace)).toBeFalse()
      })
    })
  })

  describe('setOrderedTimeout(namespace: string, val: number): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setOrderedTimeout(namespace, 100)
      const row = getRawConfiguration(namespace)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ ordered_timeout: 100 })
    })
  })

  describe('unsetOrderedTimeout(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace
        , ordered_timeout: 100
        })

        const result = DAO.unsetOrderedTimeout(namespace)
        const row = getRawConfiguration(namespace)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ ordered_timeout: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetOrderedTimeout(namespace)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(namespace)).toBeFalse()
      })
    })
  })

  describe('setActiveTimeout(namespace: string, val: number): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setActiveTimeout(namespace, 100)
      const row = getRawConfiguration(namespace)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ active_timeout: 100 })
    })
  })

  describe('unsetActiveTimeout(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace
        , active_timeout: 100
        })

        const result = DAO.unsetActiveTimeout(namespace)
        const row = getRawConfiguration(namespace)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ active_timeout: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetActiveTimeout(namespace)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(namespace)).toBeFalse()
      })
    })
  })

  describe('setConcurrency(namespace: string, val: number): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setConcurrency(namespace, 100)
      const row = getRawConfiguration(namespace)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ concurrency: 100 })
    })
  })

  describe('unsetConcurrency(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace
        , active_timeout: 100
        })

        const result = DAO.unsetConcurrency(namespace)
        const row = getRawConfiguration(namespace)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ concurrency: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetConcurrency(namespace)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(namespace)).toBeFalse()
      })
    })
  })

  describe('setThrottle(namespace: string, val: Throttle): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setThrottle(namespace, {
        duration: 100
      , limit: 200
      })
      const row = getRawConfiguration(namespace)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({
        throttle_duration: 100
      , throttle_limit: 200
      })
    })
  })

  describe('unsetThrottle(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace
        , throttle_duration: 100
        , throttle_limit: 200
        })

        const result = DAO.unsetThrottle(namespace)
        const row = getRawConfiguration(namespace)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({
          throttle_duration: null
        , throttle_limit: null
        })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetThrottle(namespace)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(namespace)).toBeFalse()
      })
    })
  })
})
