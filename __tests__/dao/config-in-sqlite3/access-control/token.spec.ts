import * as DAO from '@dao/config-in-sqlite3/access-control/token.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { getRawToken, hasRawToken, setRawToken } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('token-based access control', () => {
  describe('getAllIdsWithTokens(): string[]', () => {
    it('return string[]', () => {
      const namespace1 = 'namespace-1'
      const namespace2 = 'namespace-2'
      const namespace3 = 'namespace-3'
      setRawToken({
        token: 'token-1'
      , namespace: namespace1
      , consume_permission: 1
      , produce_permission: 0
      , clear_permission: 0
      })
      setRawToken({
        token: 'token-2'
      , namespace: namespace2
      , consume_permission: 0
      , produce_permission: 1
      , clear_permission: 0
      })
      setRawToken({
        token: 'token-3'
      , namespace: namespace3
      , consume_permission: 0
      , produce_permission: 0
      , clear_permission: 1
      })

      const result = DAO.getAllIdsWithTokens()

      expect(result).toEqual([namespace1, namespace2, namespace3])
    })
  })

  describe('getAllTokens(namespace: string): TokenInfo[]', () => {
    it('return TokenInfo[]', () => {
      const namespace = 'namespace'
      const token1 = setRawToken({
        token: 'token-1'
      , namespace
      , consume_permission: 1
      , produce_permission: 0
      , clear_permission: 0
      })
      const token2 = setRawToken({
        token: 'token-2'
      , namespace
      , consume_permission: 0
      , produce_permission: 1
      , clear_permission: 0
      })
      const token3 = setRawToken({
        token: 'token-3'
      , namespace
      , consume_permission: 0
      , produce_permission: 0
      , clear_permission: 1
      })

      const result = DAO.getAllTokens(namespace)

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
    describe('hasProduceTokens(namespace: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const namespace = 'namespace'
          setRawToken({
            token: 'token-1'
          , namespace
          , consume_permission: 0
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.hasProduceTokens(namespace)

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const namespace = 'namespace'
          setRawToken({
            token: 'token-1'
          , namespace
          , consume_permission: 1
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.hasProduceTokens(namespace)

          expect(result).toBe(false)
        })
      })
    })

    describe('matchProduceToken({ token: string; namespace: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token: 'token-1'
          , namespace
          , consume_permission: 0
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.matchProduceToken({ token, namespace })

          expect(result).toBe(true)
        })
      })

      describe('token does not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , consume_permission: 1
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.matchProduceToken({ token, namespace })

          expect(result).toBe(false)
        })
      })
    })

    describe('setProduceToken({ token: string; namespace: string })', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , consume_permission: 1
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.setProduceToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['produce_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.setProduceToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['produce_permission']).toBe(1)
        })
      })
    })

    describe('unsetProduceToken({ token: string; namespace: string })', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , consume_permission: 1
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.unsetProduceToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['produce_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.unsetProduceToken({ token, namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBe(false)
        })
      })
    })
  })

  describe('ConsumeToken', () => {
    describe('hasConsumeTokens(namespace: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , consume_permission: 1
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.hasConsumeTokens(namespace)

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , consume_permission: 0
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.hasConsumeTokens(namespace)

          expect(result).toBe(false)
        })
      })
    })

    describe('matchConsumeToken({ token: string; namespace: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , consume_permission: 1
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.matchConsumeToken({ token, namespace })

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , consume_permission: 0
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.matchConsumeToken({ token, namespace })

          expect(result).toBe(false)
        })
      })
    })

    describe('setConsumeToken(token: string, namespace: string)', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , consume_permission: 0
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.setConsumeToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['consume_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.setConsumeToken({ token, namespace })
          const row = getRawToken(token, namespace)

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
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , consume_permission: 1
          , produce_permission: 1
          , clear_permission: 0
          })

          const result = DAO.unsetConsumeToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['consume_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.unsetConsumeToken({ token, namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBe(false)
        })
      })
    })
  })

  describe('ClearToken', () => {
    describe('matchClearToken({ token: string; namespace: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , consume_permission: 0
          , produce_permission: 0
          , clear_permission: 1
          })

          const result = DAO.matchClearToken({ token, namespace })

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'id-1'
          setRawToken({
            token
          , namespace
          , consume_permission: 0
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.matchClearToken({ token, namespace })

          expect(result).toBe(false)
        })
      })
    })

    describe('setClearToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , consume_permission: 0
          , produce_permission: 0
          , clear_permission: 0
          })

          const result = DAO.setClearToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['clear_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.setClearToken({ token, namespace })
          const row = getRawToken(token, namespace)

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
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , consume_permission: 0
          , produce_permission: 0
          , clear_permission: 1
          })

          const result = DAO.unsetClearToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).toBeUndefined()
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.unsetClearToken({ token, namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBe(false)
        })
      })
    })
  })
})
