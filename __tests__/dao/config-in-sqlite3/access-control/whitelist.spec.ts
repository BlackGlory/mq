import * as DAO from '@dao/config-in-sqlite3/access-control/whitelist.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { hasRawWhitelist, setRawWhitelist } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('whitelist', () => {
  describe('getAllWhitelistItems(): string[]', () => {
    it('return string[]', () => {
      const namespace = 'namespace'
      setRawWhitelist({ namespace })

      const result = DAO.getAllWhitelistItems()

      expect(result).toEqual([namespace])
    })
  })

  describe('inWhitelist(namespace: string): boolean', () => {
    describe('exist', () => {
      it('return true', () => {
        const namespace = 'namespace'
        setRawWhitelist({ namespace })

        const result = DAO.inWhitelist(namespace)

        expect(result).toBe(true)
      })
    })

    describe('not exist', () => {
      it('return false', () => {
        const namespace = 'namespace'

        const result = DAO.inWhitelist(namespace)

        expect(result).toBe(false)
      })
    })
  })

  describe('addWhitelistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawWhitelist({ namespace })

        const result = DAO.addWhitelistItem(namespace)

        expect(result).toBeUndefined()
        expect(hasRawWhitelist(namespace)).toBe(true)
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.addWhitelistItem(namespace)

        expect(result).toBeUndefined()
        expect(hasRawWhitelist(namespace)).toBe(true)
      })
    })
  })

  describe('removeWhitelistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawWhitelist({ namespace })

        const result = DAO.removeWhitelistItem(namespace)

        expect(result).toBeUndefined()
        expect(hasRawWhitelist(namespace)).toBe(false)
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.removeWhitelistItem(namespace)

        expect(result).toBeUndefined()
        expect(hasRawWhitelist(namespace)).toBe(false)
      })
    })
  })
})
