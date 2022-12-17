import * as DAO from '@dao/data-in-sqlite3/mq/complete-message'
import { BadMessageState, NotFound } from '@dao/data-in-sqlite3/mq/error'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setMinimalRawMessage, setRawStats, getRawStats, hasRawMessage } from './utils'
import { getError } from 'return-style'

const timestamp = Date.now()

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/mq/utils/get-timestamp', () => ({
  getTimestamp() {
    return timestamp
  }
}))

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('completeMessage(namespace: string, messageId: string): void', () => {
  describe('message does not exist', () => {
    it('throw NotFound', () => {
      const namespace = 'namespace'
      const messageId = 'message-id'

      const err = getError(() => DAO.completeMessage(namespace, messageId))

      expect(err).toBeInstanceOf(NotFound)
    })
  })

  describe('message exists', () => {
    describe('state: active', () => {
      it('delete message, completed++', () => {
        const namespace = 'namespace'
        const messageId = 'message-id'
        setMinimalRawMessage({
          namespace
        , id: messageId
        , state: 'active'
        , state_updated_at: 0
        })
        setRawStats({
          namespace
        , drafting: 0
        , waiting: 0
        , ordered: 0
        , active: 1
        , completed: 0
        , failed: 0
        })

        const result = DAO.completeMessage(namespace, messageId)
        const exists = hasRawMessage(namespace, messageId)
        const rawStatsResult = getRawStats(namespace)

        expect(result).toBeUndefined()
        expect(exists).toBe(false)
        expect(rawStatsResult).toMatchObject({
          drafting: 0
        , waiting: 0
        , ordered: 0
        , active: 0
        , completed: 1
        , failed: 0
        })
      })
    })

    describe('other states', () => {
      it('throw BadMessageState', async () => {
        const namespace = 'namespace'
        const messageId = 'message-id'
        setMinimalRawMessage({
          namespace
        , id: messageId
        , state: 'waiting'
        , state_updated_at: 0
        })
        setRawStats({
          namespace
        , drafting: 0
        , waiting: 1
        , ordered: 0
        , active: 0
        , completed: 0
        , failed: 0
        })

        const err = getError(() => DAO.completeMessage(namespace, messageId))

        expect(err).toBeInstanceOf(BadMessageState)
      })
    })
  })
})
