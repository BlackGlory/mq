import * as DAO from '@dao/config-in-sqlite3/access-control/blacklist.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { hasRawBlacklist, setRawBlacklist } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('blacklist', () => {
  describe('getAllBlacklistItems(): string[]', () => {
    it('return string[]', async () => {
      const namespace = 'namespace'
      setRawBlacklist({ namespace })

      const result = DAO.getAllBlacklistItems()

      expect(result).toEqual([namespace])
    })
  })

  describe('inBlacklist(namespace: string): boolean', () => {
    describe('exist', () => {
      it('return true', async () => {
        const namespace = 'namespace'
        setRawBlacklist({ namespace })

        const result = DAO.inBlacklist(namespace)

        expect(result).toBe(true)
      })
    })

    describe('not exist', () => {
      it('return false', () => {
        const namespace = 'namespace'

        const result = DAO.inBlacklist(namespace)

        expect(result).toBe(false)
      })
    })
  })

  describe('addBlacklistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawBlacklist({ namespace })

        const result = DAO.addBlacklistItem(namespace)

        expect(result).toBeUndefined()
        expect(hasRawBlacklist(namespace)).toBe(true)
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.addBlacklistItem(namespace)

        expect(result).toBeUndefined()
        expect(hasRawBlacklist(namespace)).toBe(true)
      })
    })
  })

  describe('removeBlacklistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawBlacklist({ namespace })

        const result = DAO.removeBlacklistItem(namespace)

        expect(result).toBeUndefined()
        expect(hasRawBlacklist(namespace)).toBe(false)
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.removeBlacklistItem(namespace)

        expect(result).toBeUndefined()
        expect(hasRawBlacklist(namespace)).toBe(false)
      })
    })
  })
})
