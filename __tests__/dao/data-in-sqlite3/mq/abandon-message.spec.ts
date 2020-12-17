import * as DAO from '@dao/data-in-sqlite3/mq/abandon-message'
import { getDatabase } from '@dao/data-in-sqlite3/database'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { setRawMessage, setRawStats, getRawStats, hasRawMessage } from './utils'
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

describe('abandonMessage(queueId: string, messageId: string): void', () => {
  describe('state: drafting', () => {
    it('delete message', async () => {
      const db = await getDatabase()
      const queueId = 'queue-id'
      const messageId = 'message-id'
      setRawMessage(db, {
        mq_id: queueId
      , message_id: messageId
      , hash: 'hash'
      , payload: 'payload'
      , priority: null
      , state: 'drafting'
      , state_updated_at: 0
      , type: 'type'
      })
      setRawStats(db, {
        mq_id: queueId
      , drafting: 1
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      })

      const result = DAO.abandonMessage(queueId, messageId)
      const exists = hasRawMessage(db, queueId, messageId)
      const stats = getRawStats(db, queueId)

      expect(result).toBeUndefined()
      expect(exists).toBeFalse()
      expect(stats).toMatchObject({
        drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      })
    })
  })

  describe('state: waiting', () => {
    it('delete message', async () => {
      const db = await getDatabase()
      const queueId = 'queue-id'
      const messageId = 'message-id'
      setRawMessage(db, {
        mq_id: queueId
      , message_id: messageId
      , hash: 'hash'
      , payload: 'payload'
      , priority: null
      , state: 'waiting'
      , state_updated_at: 0
      , type: 'type'
      })
      setRawStats(db, {
        mq_id: queueId
      , drafting: 0
      , waiting: 1
      , ordered: 0
      , active: 0
      , completed: 0
      })

      const result = DAO.abandonMessage(queueId, messageId)
      const exists = hasRawMessage(db, queueId, messageId)
      const stats = getRawStats(db, queueId)

      expect(result).toBeUndefined()
      expect(exists).toBeFalse()
      expect(stats).toMatchObject({
        drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      })
    })
  })

  describe('state: ordered', () => {
    it('delete message', async () => {
      const db = await getDatabase()
      const queueId = 'queue-id'
      const messageId = 'message-id'
      setRawMessage(db, {
        mq_id: queueId
      , message_id: messageId
      , hash: 'hash'
      , payload: 'payload'
      , priority: null
      , state: 'ordered'
      , state_updated_at: 0
      , type: 'type'
      })
      setRawStats(db, {
        mq_id: queueId
      , drafting: 0
      , waiting: 0
      , ordered: 1
      , active: 0
      , completed: 0
      })

      const result = DAO.abandonMessage(queueId, messageId)
      const exists = hasRawMessage(db, queueId, messageId)
      const stats = getRawStats(db, queueId)

      expect(result).toBeUndefined()
      expect(exists).toBeFalse()
      expect(stats).toMatchObject({
        drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      })
    })
  })

  describe('state: active', () => {
    it('delete message', async () => {
      const db = await getDatabase()
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

      const result = DAO.abandonMessage(queueId, messageId)
      const exists = hasRawMessage(db, queueId, messageId)
      const stats = getRawStats(db, queueId)

      expect(result).toBeUndefined()
      expect(exists).toBeFalse()
      expect(stats).toMatchObject({
        drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      })
    })
  })
})