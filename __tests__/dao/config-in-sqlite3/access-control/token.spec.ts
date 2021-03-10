import * as DAO from '@dao/config-in-sqlite3/access-control/token'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getRawToken, hasRawToken, setRawToken } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('token-based access control', () => {
  describe('getAllIdsWithTokens(): string[]', () => {
    it('return string[]', () => {
      const id1 = 'id-1'
      const id2 = 'id-2'
      const id3 = 'id-3'
      setRawToken({
        token: 'token-1'
      , mq_id: id1
      , consume_permission: 1
      , produce_permission: 0
      , clear_permission: 0
      })
      setRawToken({
        token: 'token-2'
      , mq_id: id2
      , consume_permission: 0
      , produce_permission: 1
      , clear_permission: 0
      })
      setRawToken({
        token: 'token-3'
      , mq_id: id3
      , consume_permission: 0
      , produce_permission: 0
      , clear_permission: 1
      })

      const result = DAO.getAllIdsWithTokens()

      expect(result).toEqual([id1, id2, id3])
    })
  })

  describe('getAllTokens(id: string): TokenInfo[]', () => {
    it('return TokenInfo[]', () => {
      const id = 'id-1'
      const token1 = setRawToken({
        token: 'token-1'
      , mq_id: id
      , consume_permission: 1
      , produce_permission: 0
      , clear_permission: 0
      })
      const token2 = setRawToken({
        token: 'token-2'
      , mq_id: id
      , consume_permission: 0
      , produce_permission: 1
      , clear_permission: 0
      })
      const token3 = setRawToken({
        token: 'token-3'
      , mq_id: id
      , consume_permission: 0
      , produce_permission: 0
      , clear_permission: 1
      })

      const result = DAO.getAllTokens(id)

      expect(result).toEqual([
        {
          token: token1.token
        , consume: !!token1.consume_permission
        , produce: !!token1.produce_permission
        , clear: !!token1.clear_permission
        }
      , {
          token: token2.token
        , consume: !!token2.consume_permission
        , produce: !!token2.produce_permission
        , clear: !!token2.clear_permission
        }
      , {
          token: token3.token
        , consume: !!token3.consume_permission
        , produce: !!token3.produce_permission
        , clear: !!token3.clear_permission
        }
      ])
    })
  })

  describe('ProduceToken', () => {
    describe('hasProduceTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const id = 'id-1'
          setRawToken({
            token: 'token-1'
          , mq_id: id
          , consume_permission: 0
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.hasProduceTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const id = 'id-1'
          setRawToken({
            token: 'token-1'
          , mq_id: id
          , consume_permission: 1
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.hasProduceTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchProduceToken({ token: string; id: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token: 'token-1'
          , mq_id: id
          , consume_permission: 0
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.matchProduceToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('token does not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , mq_id: id
          , consume_permission: 1
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.matchProduceToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setProduceToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , mq_id: id
          , consume_permission: 1
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.setProduceToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['produce_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setProduceToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['produce_permission']).toBe(1)
        })
      })
    })

    describe('unsetProduceToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , mq_id: id
          , consume_permission: 1
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.unsetProduceToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['produce_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetProduceToken({ token, id })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, id)).toBeFalse()
        })
      })
    })
  })

  describe('ConsumeToken', () => {
    describe('hasConsumeTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , mq_id: id
          , consume_permission: 1
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.hasConsumeTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , mq_id: id
          , consume_permission: 0
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.hasConsumeTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchConsumeToken({ token: string; id: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , mq_id: id
          , consume_permission: 1
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.matchConsumeToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , mq_id: id
          , consume_permission: 0
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.matchConsumeToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setConsumeToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , mq_id: id
          , consume_permission: 0
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.setConsumeToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['consume_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setConsumeToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['consume_permission']).toBe(1)
        })
      })
    })

    describe('unsetConsumeToken', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , mq_id: id
          , consume_permission: 1
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.unsetConsumeToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['consume_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetConsumeToken({ token, id })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, id)).toBeFalse()
        })
      })
    })
  })

  describe('ClearToken', () => {
    describe('matchClearToken({ token: string; id: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , mq_id: id
          , consume_permission: 0
          , produce_permission: 0
          , clear_permission: 1
          })

          const result = DAO.matchClearToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , mq_id: id
          , consume_permission: 0
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.matchClearToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setClearToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , mq_id: id
          , consume_permission: 0
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.setClearToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['clear_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setClearToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['clear_permission']).toBe(1)
        })
      })
    })

    describe('unsetClearToken', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , mq_id: id
          , consume_permission: 0
          , produce_permission: 0
          , clear_permission: 1
          })

          const result = DAO.unsetClearToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).toBeUndefined()
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetClearToken({ token, id })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, id)).toBeFalse()
        })
      })
    })
  })
})
