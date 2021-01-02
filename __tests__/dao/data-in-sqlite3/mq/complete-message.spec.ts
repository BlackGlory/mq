import * as DAO from '@dao/data-in-sqlite3/mq/complete-message'
import { BadMessageState } from '@dao/data-in-sqlite3/mq/error'
import { getDatabase } from '@dao/data-in-sqlite3/database'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { setRawMessage, setRawStats, getRawStats, hasRawMessage } from './utils'
import { getError } from 'return-style'
import 'jest-extended'

const timestamp = Date.now()

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/mq/utils/get-timestamp', () => ({
  getTimestamp() {
    return timestamp
  }
}))

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('completeMessage(queueId: string, messageId: string): void', () => {
  describe('state: active', () => {
    it('delete message, completed++', () => {
      const db = getDatabase()
      const queueId = 'queue-id'
      const messageId = 'message-id'
      setRawMessage(db, {
        mq_id: queueId
      , message_id: messageId
      , hash: 'hash'
      , payload: 'payload'
      , priority: null
      , state: 'active'
      , state_updated_at: 0
      , type: 'type'
      })
      setRawStats(db, {
        mq_id: queueId
      , drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 1
      , completed: 0
      })

      const result = DAO.completeMessage(queueId, messageId)
      const exists = hasRawMessage(db, queueId, messageId)
      const stats = getRawStats(db, queueId)

      expect(result).toBeUndefined()
      expect(exists).toBeFalse()
      expect(stats).toMatchObject({
        drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 1
      })
    })
  })

  describe('other states', () => {
    it('throw BadMessageState', async () => {
      const queueId = 'queue-id'
      const messageId = 'message-id'

      const err = getError(() => DAO.completeMessage(queueId, messageId))

      expect(err).toBeInstanceOf(BadMessageState)
    })
  })
})
