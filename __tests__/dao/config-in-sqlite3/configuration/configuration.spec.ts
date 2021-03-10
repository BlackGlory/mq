import * as DAO from '@dao/config-in-sqlite3/configuration/configuration'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setMinimalConfiguration, getRawConfiguration, hasRawConfiguration } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('Configuration', () => {
  describe('getAllIdsWithConfigurations(): string[]', () => {
    it('return string[]', () => {
      const id = 'id'
      setMinimalConfiguration({
        mq_id: id
      , uniq: 1
      })

      const result = DAO.getAllIdsWithConfigurations()

      expect(result).toEqual([id])
    })
  })

  describe('getConfigurations(mqId: string): Configurations', () => {
    describe('exists', () => {
      it('return', () => {
        const id = 'id'
        setMinimalConfiguration({
          mq_id: id
        , uniq: 1
        })

        const result = DAO.getConfigurations(id)

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
        const id = 'id'

        const result = DAO.getConfigurations(id)

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

  describe('setUnique(mqId: string, val: boolean): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setUnique(id, true)
      const row = getRawConfiguration(id)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ uniq: 1 })
    })
  })

  describe('unsetUnique(mqId: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setMinimalConfiguration({
          mq_id: id
        , drafting_timeout: 100
        })

        const result = DAO.unsetUnique(id)
        const row = getRawConfiguration(id)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ uniq: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetUnique(id)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(id)).toBeFalse()
      })
    })
  })

  describe('setDraftingTimeout(mqId: string, val: number): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setDraftingTimeout(id, 100)
      const row = getRawConfiguration(id)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ drafting_timeout: 100 })
    })
  })

  describe('unsetDraftingTimeout(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setMinimalConfiguration({
          mq_id: id
        , drafting_timeout: 100
        })

        const result = DAO.unsetDraftingTimeout(id)
        const row = getRawConfiguration(id)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ drafting_timeout: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetDraftingTimeout(id)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(id)).toBeFalse()
      })
    })
  })

  describe('setOrderedTimeout(mqId: string, val: number): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setOrderedTimeout(id, 100)
      const row = getRawConfiguration(id)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ ordered_timeout: 100 })
    })
  })

  describe('unsetOrderedTimeout(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setMinimalConfiguration({
          mq_id: id
        , ordered_timeout: 100
        })

        const result = DAO.unsetOrderedTimeout(id)
        const row = getRawConfiguration(id)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ ordered_timeout: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetOrderedTimeout(id)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(id)).toBeFalse()
      })
    })
  })

  describe('setActiveTimeout(mqId: string, val: number): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setActiveTimeout(id, 100)
      const row = getRawConfiguration(id)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ active_timeout: 100 })
    })
  })

  describe('unsetActiveTimeout(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setMinimalConfiguration({
          mq_id: id
        , active_timeout: 100
        })

        const result = DAO.unsetActiveTimeout(id)
        const row = getRawConfiguration(id)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ active_timeout: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetActiveTimeout(id)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(id)).toBeFalse()
      })
    })
  })

  describe('setConcurrency(mqId: string, val: number): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setConcurrency(id, 100)
      const row = getRawConfiguration(id)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ concurrency: 100 })
    })
  })

  describe('unsetConcurrency(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setMinimalConfiguration({
          mq_id: id
        , active_timeout: 100
        })

        const result = DAO.unsetConcurrency(id)
        const row = getRawConfiguration(id)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ concurrency: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetConcurrency(id)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(id)).toBeFalse()
      })
    })
  })

  describe('setThrottle(mqId: string, val: Throttle): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setThrottle(id, {
        duration: 100
      , limit: 200
      })
      const row = getRawConfiguration(id)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({
        throttle_duration: 100
      , throttle_limit: 200
      })
    })
  })

  describe('unsetThrottle(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setMinimalConfiguration({
          mq_id: id
        , throttle_duration: 100
        , throttle_limit: 200
        })

        const result = DAO.unsetThrottle(id)
        const row = getRawConfiguration(id)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({
          throttle_duration: null
        , throttle_limit: null
        })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetThrottle(id)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(id)).toBeFalse()
      })
    })
  })
})
