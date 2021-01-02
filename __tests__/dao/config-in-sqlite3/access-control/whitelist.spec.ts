import * as DAO from '@dao/config-in-sqlite3/access-control/whitelist'
import { getDatabase } from '@dao/config-in-sqlite3/database'
import { resetEnvironment, resetDatabases } from '@test/utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('whitelist', () => {
  describe('getAllWhitelistItems(): string[]', () => {
    it('return string[]', () => {
      const id = 'id-1'
      insert(id)

      const result = DAO.getAllWhitelistItems()

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([id])
    })
  })

  describe('inWhitelist(id: string): boolean', () => {
    describe('exist', () => {
      it('return true', () => {
        const id = 'id-1'
        insert(id)

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
        insert(id)

        const result = DAO.addWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(exist(id)).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const id = 'id-1'

        const result = DAO.addWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(exist(id)).toBeTrue()
      })
    })
  })

  describe('removeWhitelistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const id = 'id-1'
        insert(id)

        const result = DAO.removeWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(exist(id)).toBeFalse()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const id = 'id-1'

        const result = DAO.removeWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(exist(id)).toBeFalse()
      })
    })
  })
})

function exist(id: string): boolean {
  return !!select(id)
}

function insert(id: string): void {
  getDatabase().prepare('INSERT INTO mq_whitelist (mq_id) VALUES ($id);').run({ id });
}

function select(id: string) {
  return getDatabase().prepare('SELECT * FROM mq_whitelist WHERE mq_id = $id;').get({ id })
}
