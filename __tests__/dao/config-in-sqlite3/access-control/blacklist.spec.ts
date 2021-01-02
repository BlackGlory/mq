import * as DAO from '@dao/config-in-sqlite3/access-control/blacklist'
import { getDatabase } from '@dao/config-in-sqlite3/database'
import { resetDatabases, resetEnvironment } from '@test/utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('blacklist', () => {
  describe('getAllBlacklistItems(): string[]', () => {
    it('return string[]', async () => {
      const id = 'id-1'
      insert(id)

      const result = DAO.getAllBlacklistItems()

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([id])
    })
  })

  describe('inBlacklist(id: string): boolean', () => {
    describe('exist', () => {
      it('return true', async () => {
        const id = 'id-1'
        insert(id)

        const result = DAO.inBlacklist(id)

        expect(result).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return false', () => {
        const id = 'id-1'

        const result = DAO.inBlacklist(id)

        expect(result).toBeFalse()
      })
    })
  })

  describe('addBlacklistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const id = 'id-1'
        insert(id)

        const result = DAO.addBlacklistItem(id)

        expect(result).toBeUndefined()
        expect(exist(id)).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const id = 'id-1'

        const result = DAO.addBlacklistItem(id)

        expect(result).toBeUndefined()
        expect(exist(id)).toBeTrue()
      })
    })
  })

  describe('removeBlacklistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const id = 'id-1'
        insert(id)

        const result = DAO.removeBlacklistItem(id)

        expect(result).toBeUndefined()
        expect(exist(id)).toBeFalse()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const id = 'id-1'

        const result = DAO.removeBlacklistItem(id)

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
  getDatabase().prepare('INSERT INTO mq_blacklist (mq_id) VALUES ($id);').run({ id });
}

function select(id: string) {
  return getDatabase().prepare('SELECT * FROM mq_blacklist WHERE mq_id = $id;').get({ id })
}
