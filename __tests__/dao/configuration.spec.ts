import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { initializeDatabases, clearDatabase } from '@test/utils.js'
import { setMinimalConfiguration, getRawConfiguration, hasRawConfiguration } from './utils.js'
import { getAllNamespacesWithConfiguration, getConfiguration, setActiveTimeout, setConcurrency, setDraftingTimeout, setOrderedTimeout, setUnique, unsetActiveTimeout, unsetConcurrency, unsetDraftingTimeout, unsetOrderedTimeout, unsetUnique } from '@dao/configuration.js'

beforeEach(initializeDatabases)
afterEach(clearDatabase)

describe('Configuration', () => {
  describe('getAllNamespacesWithConfiguration', () => {
    it('return string[]', () => {
      const namespace = 'namespace'
      setMinimalConfiguration({
        namespace
      , uniq: 1
      })

      const result = getAllNamespacesWithConfiguration()

      expect(result).toEqual([namespace])
    })
  })

  describe('getConfiguration', () => {
    describe('exists', () => {
      it('return', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace
        , uniq: 1
        })

        const result = getConfiguration(namespace)

        expect(result).toEqual({
          unique: true
        , draftingTimeout: null
        , orderedTimeout: null
        , activeTimeout: null
        , concurrency: null
        })
      })
    })

    describe('does not exist', () => {
      it('return', () => {
        const namespace = 'namespace'

        const result = getConfiguration(namespace)

        expect(result).toEqual({
          unique: null
        , draftingTimeout: null
        , orderedTimeout: null
        , activeTimeout: null
        , concurrency: null
        })
      })
    })
  })

  describe('setUnique', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = setUnique(namespace, true)
      const row = getRawConfiguration(namespace)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ uniq: 1 })
    })
  })

  describe('unsetUnique', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace
        , drafting_timeout: 100
        })

        const result = unsetUnique(namespace)
        const row = getRawConfiguration(namespace)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ uniq: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = unsetUnique(namespace)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(namespace)).toBe(false)
      })
    })
  })

  describe('setDraftingTimeout', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = setDraftingTimeout(namespace, 100)
      const row = getRawConfiguration(namespace)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ drafting_timeout: 100 })
    })
  })

  describe('unsetDraftingTimeout', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace
        , drafting_timeout: 100
        })

        const result = unsetDraftingTimeout(namespace)
        const row = getRawConfiguration(namespace)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ drafting_timeout: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = unsetDraftingTimeout(namespace)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(namespace)).toBe(false)
      })
    })
  })

  describe('setOrderedTimeout', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = setOrderedTimeout(namespace, 100)
      const row = getRawConfiguration(namespace)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ ordered_timeout: 100 })
    })
  })

  describe('unsetOrderedTimeout', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace
        , ordered_timeout: 100
        })

        const result = unsetOrderedTimeout(namespace)
        const row = getRawConfiguration(namespace)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ ordered_timeout: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = unsetOrderedTimeout(namespace)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(namespace)).toBe(false)
      })
    })
  })

  describe('setActiveTimeout', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = setActiveTimeout(namespace, 100)
      const row = getRawConfiguration(namespace)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ active_timeout: 100 })
    })
  })

  describe('unsetActiveTimeout', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace
        , active_timeout: 100
        })

        const result = unsetActiveTimeout(namespace)
        const row = getRawConfiguration(namespace)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ active_timeout: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = unsetActiveTimeout(namespace)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(namespace)).toBe(false)
      })
    })
  })

  describe('setConcurrency', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = setConcurrency(namespace, 100)
      const row = getRawConfiguration(namespace)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ concurrency: 100 })
    })
  })

  describe('unsetConcurrency', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace
        , active_timeout: 100
        })

        const result = unsetConcurrency(namespace)
        const row = getRawConfiguration(namespace)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ concurrency: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = unsetConcurrency(namespace)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(namespace)).toBe(false)
      })
    })
  })
})
