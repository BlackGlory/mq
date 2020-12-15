import * as DAO from '@dao/config-in-sqlite3/access-control/token'
import { getDatabase } from '@dao/config-in-sqlite3/database'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { Database } from 'better-sqlite3'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('token-based access control', () => {
  describe('getAllIdsWithTokens(): string[]', () => {
    it('return string[]', async () => {
      const db = getDatabase()
      const id1 = 'id-1'
      const token1 = 'token-1'
      const id2 = 'id-2'
      const token2 = 'token-2'
      const id3 = 'id-3'
      const token3 = 'token-3'
      insert(db, { token: token1, id: id1, consume: true })
      insert(db, { token: token2, id: id2, produce: true })
      insert(db, { token: token3, id: id3, clear: true })

      const result = DAO.getAllIdsWithTokens()

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([id1, id2, id3])
    })
  })

  describe('getAllTokens(id: string): TokenInfo[]', () => {
    it('return TokenInfo[]', async () => {
      const db = getDatabase()
      const id = 'id-1'
      const token1 = 'token-1'
      const token2 = 'token-2'
      const token3 = 'token-3'
      insert(db, { token: token1, id, consume: true })
      insert(db, { token: token2, id, produce: true })
      insert(db, { token: token3, id, clear: true })

      const result = DAO.getAllTokens(id)

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([
        { token: token1, consume: true, produce: false, clear: false }
      , { token: token2, consume: false, produce: true, clear: false }
      , { token: token3, consume: false, produce: false, clear: true }
      ])
    })
  })

  describe('ProduceToken', () => {
    describe('hasProduceTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, consume: false, produce: true })

          const result = DAO.hasProduceTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, consume: true, produce: false })

          const result = DAO.hasProduceTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchProduceToken({ token: string; id: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, consume: false, produce: true })

          const result = DAO.matchProduceToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('token does not exist', () => {
        it('return false', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, consume: true, produce: false })

          const result = DAO.matchProduceToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setProduceToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('update row', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, consume: true, produce: false })

          const result = DAO.setProduceToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['produce_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setProduceToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['produce_permission']).toBe(1)
        })
      })
    })

    describe('unsetProduceToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('return undefined', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, consume: true, produce: true })

          const result = DAO.unsetProduceToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['produce_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetProduceToken({ token, id })

          expect(result).toBeUndefined()
          expect(exist(db, { token, id })).toBeFalse()
        })
      })
    })
  })

  describe('ConsumeToken', () => {
    describe('hasConsumeTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, consume: true, produce: false })

          const result = DAO.hasConsumeTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, consume: false, produce: true })

          const result = DAO.hasConsumeTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchConsumeToken({ token: string; id: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, consume: true, produce: false })

          const result = DAO.matchConsumeToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, consume: false, produce: true })

          const result = DAO.matchConsumeToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setConsumeToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, consume: false, produce: true })

          const result = DAO.setConsumeToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['consume_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setConsumeToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['consume_permission']).toBe(1)
        })
      })
    })

    describe('unsetConsumeToken', () => {
      describe('token exists', () => {
        it('return undefined', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, consume: true, produce: true })

          const result = DAO.unsetConsumeToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['consume_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetConsumeToken({ token, id })

          expect(result).toBeUndefined()
          expect(exist(db, { token, id })).toBeFalse()
        })
      })
    })
  })

  describe('ClearToken', () => {
    describe('matchClearToken({ token: string; id: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, clear: true })

          const result = DAO.matchClearToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, clear: false })

          const result = DAO.matchClearToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setClearToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, clear: false })

          const result = DAO.setClearToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['clear_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setClearToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['clear_permission']).toBe(1)
        })
      })
    })

    describe('unsetClearToken', () => {
      describe('token exists', () => {
        it('return undefined', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, clear: true })

          const result = DAO.unsetClearToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row).toBeUndefined()
        })
      })

      describe('token does not exist', () => {
        it('return undefined', async () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetClearToken({ token, id })

          expect(result).toBeUndefined()
          expect(exist(db, { token, id })).toBeFalse()
        })
      })
    })
  })
})

function exist(db: Database, { token, id }: { token: string; id: string }) {
  return !!select(db, { token, id })
}

function select(db: Database, { token, id }: { token: string; id: string }) {
  return db.prepare(`
    SELECT *
      FROM mq_token
     WHERE token = $token AND mq_id = $id;
  `).get({ token, id })
}

function insert(
  db: Database
, { token, id, consume = false, produce = false, clear = false }: {
    token: string
    id: string
    consume?: boolean
    produce?: boolean
    clear?: boolean
  }
) {
  db.prepare(`
    INSERT INTO mq_token (
      token
    , mq_id
    , produce_permission
    , consume_permission
    , clear_permission
    )
    VALUES ($token, $id, $produce, $consume, $clear);
  `).run({
    token
  , id
  , produce: produce ? 1 : 0
  , consume: consume ? 1 : 0
  , clear: clear ? 1 : 0
  })
}
