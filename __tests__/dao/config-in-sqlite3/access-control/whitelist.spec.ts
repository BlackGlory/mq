import * as DAO from '@dao/config-in-sqlite3/access-control/whitelist'
import { reset } from '@test/utils'
import { hasRawWhitelist, setRawWhitelist } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(reset)

describe('whitelist', () => {
  describe('getAllWhitelistItems(): string[]', () => {
    it('return string[]', () => {
      const id = 'id-1'
      setRawWhitelist({ mq_id: id })

      const result = DAO.getAllWhitelistItems()

      expect(result).toEqual([id])
    })
  })

  describe('inWhitelist(id: string): boolean', () => {
    describe('exist', () => {
      it('return true', () => {
        const id = 'id-1'
        setRawWhitelist({ mq_id: id })

        const result = DAO.inWhitelist(id)

        expect(result).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return false', () => {
        const id = 'id-1'

        const result = DAO.inWhitelist(id)

        expect(result).toBeFalse()
      })
    })
  })

  describe('addWhitelistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const id = 'id-1'
        setRawWhitelist({ mq_id: id })

        const result = DAO.addWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(hasRawWhitelist(id)).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const id = 'id-1'

        const result = DAO.addWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(hasRawWhitelist(id)).toBeTrue()
      })
    })
  })

  describe('removeWhitelistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const id = 'id-1'
        setRawWhitelist({ mq_id: id })

        const result = DAO.removeWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(hasRawWhitelist(id)).toBeFalse()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const id = 'id-1'

        const result = DAO.removeWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(hasRawWhitelist(id)).toBeFalse()
      })
    })
  })
})
