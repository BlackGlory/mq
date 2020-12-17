import * as DAO from '@dao/data-in-sqlite3/mq/set-message'
import { hash } from '@dao/data-in-sqlite3/mq/utils/hash'
import { BadMessageState, DuplicatePayload } from '@dao/data-in-sqlite3/mq/error'
import { getDatabase } from '@dao/data-in-sqlite3/database'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { setRawMessage, setRawStats, getRawMessage, getRawStats } from './utils'
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

describe('setMessage(queueId: string, messageId: string, type: string, payload: string, unique?: boolean): void', () => {
  describe('unique', () => {
    describe('duplicate', () => {
      it('throw DuplicatePayload', async () => {
        const db = await getDatabase()
        const queueId = 'queue-id'
        const messageId = 'message-id'
        const type = 'text/plain'
        const payload = 'payload'
        setRawStats(db, {
          mq_id: queueId
        , drafting: 1
        , waiting: 1
        , ordered: 0
        , active: 0
        , completed: 0
        })
        setRawMessage(db, {
          mq_id: queueId
        , message_id: 'old-message'
        , priority: null
        , type: 'text/plain'
        , payload
        , hash: hash(payload)
        , state: 'waiting'
        , state_updated_at: 0
        })
        setRawMessage(db, {
          mq_id: queueId
        , message_id: messageId
        , priority: null
        , type: null
        , payload: null
        , hash: null
        , state: 'drafting'
        , state_updated_at: 0
        })

        const result = getError(() => DAO.setMessage(queueId, messageId, type, payload, true))
        const message = getRawMessage(db, queueId, messageId)
        const stats = getRawStats(db, queueId)

        expect(result).toBeInstanceOf(DuplicatePayload)
        expect(message).toMatchObject({
          priority: null
        , type: null
        , payload: null
        , hash: null
        , state: 'drafting'
        , state_updated_at: 0
        })
        expect(stats).toMatchObject({
          drafting: 1
        , waiting: 1
        , ordered: 0
        , active: 0
        , completed: 0
        })
      })
    })

    describe('not duplicate', () => {
      it('update message and convert state to waiting', async () => {
        const db = await getDatabase()
        const queueId = 'queue-id'
        const messageId = 'message-id'
        const type = 'text/plain'
        const payload = 'payload'
        setRawStats(db, {
          mq_id: queueId
        , drafting: 1
        , waiting: 1
        , ordered: 0
        , active: 0
        , completed: 0
        })
        setRawMessage(db, {
          mq_id: queueId
        , message_id: 'old-message'
        , priority: null
        , type: 'text/plain'
        , payload: 'old-payload'
        , hash: hash('old-payload')
        , state: 'waiting'
        , state_updated_at: 0
        })
        setRawMessage(db, {
          mq_id: queueId
        , message_id: messageId
        , priority: null
        , type: null
        , payload: null
        , hash: null
        , state: 'drafting'
        , state_updated_at: 0
        })

        const result = DAO.setMessage(queueId, messageId, type, payload, true)
        const message = getRawMessage(db, queueId, messageId)
        const stats = getRawStats(db, queueId)

        expect(result).toBeUndefined()
        expect(message).toMatchObject({
          priority: null
        , type
        , payload
        , hash: expect.any(String)
        , state: 'waiting'
        , state_updated_at: timestamp
        })
        expect(stats).toMatchObject({
          drafting: 0
        , waiting: 2
        , ordered: 0
        , active: 0
        , completed: 0
        })
      })
    })
  })

  describe('state: drafting', () => {
    it('update message and convert state to waiting', async () => {
      const db = await getDatabase()
      const queueId = 'queue-id'
      const messageId = 'message-id'
      const type = 'text/plain'
      const payload = 'payload'
      setRawStats(db, {
        mq_id: queueId
      , drafting: 1
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      })
      setRawMessage(db, {
        mq_id: queueId
      , message_id: messageId
      , priority: null
      , type: null
      , payload: null
      , hash: null
      , state: 'drafting'
      , state_updated_at: 0
      })

      const result = DAO.setMessage(queueId, messageId, type, payload)
      const message = getRawMessage(db, queueId, messageId)
      const stats = getRawStats(db, queueId)

      expect(result).toBeUndefined()
      expect(message).toMatchObject({
        priority: null
      , type
      , payload
      , hash: expect.any(String)
      , state: 'waiting'
      , state_updated_at: timestamp
      })
      expect(stats).toMatchObject({
        drafting: 0
      , waiting: 1
      , ordered: 0
      , active: 0
      , completed: 0
      })
    })
  })

  describe('state: waiting', () => {
    it('update message', async () => {
      const db = await getDatabase()
      const queueId = 'queue-id'
      const messageId = 'message-id'
      const type = 'text/plain'
      const payload = 'payload'
      const oldHash = 'old-hash'
      setRawStats(db, {
        mq_id: queueId
      , drafting: 0
      , waiting: 1
      , ordered: 0
      , active: 0
      , completed: 0
      })
      setRawMessage(db, {
        mq_id: queueId
      , message_id: messageId
      , priority: null
      , type: 'old-type'
      , payload: 'old-payload'
      , hash: oldHash
      , state: 'waiting'
      , state_updated_at: 0
      })

      const result = DAO.setMessage(queueId, messageId, type, payload)
      const message = getRawMessage(db, queueId, messageId)
      const stats = getRawStats(db, queueId)

      expect(result).toBeUndefined()
      expect(message).toMatchObject({
        priority: null
      , type
      , payload
      , state: 'waiting'
      , state_updated_at: 0
      })
      expect(message.hash).toBeString()
      expect(message.hash).not.toBe(oldHash)
      expect(stats).toMatchObject({
        drafting: 0
      , waiting: 1
      , ordered: 0
      , active: 0
      , completed: 0
      })
    })
  })

  describe('other states', () => {
    it('throw BadMessageState', async () => {
      const db = await getDatabase()
      const queueId = 'queue-id'
      const messageId = 'message-id'
      const type = 'text/plain'
      const payload = 'payload'
      setRawStats(db, {
        mq_id: queueId
      , drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 1
      , completed: 0
      })
      setRawMessage(db, {
        mq_id: queueId
      , message_id: messageId
      , priority: null
      , type: 'old-type'
      , payload: 'old-payload'
      , hash: 'old-hash'
      , state: 'active'
      , state_updated_at: 0
      })

      const err = getError(() => DAO.setMessage(queueId, messageId, type, payload))
      const message = getRawMessage(db, queueId, messageId)
      const stats = getRawStats(db, queueId)

      expect(err).toBeInstanceOf(BadMessageState)
      expect(message).toMatchObject({
        priority: null
      , type: 'old-type'
      , payload: 'old-payload'
      , state: 'active'
      , hash: 'old-hash'
      , state_updated_at: 0
      })
      expect(stats).toMatchObject({
        drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 1
      , completed: 0
      })
    })
  })
})
