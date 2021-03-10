import * as DAO from '@dao/data-in-sqlite3/mq/rollback-outdated-messages'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setRawMessage, setRawStats, getRawStats, hasRawMessage, getRawMessage } from './utils'
import 'jest-extended'

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

describe('rollbackOutdatedDraftingMessages(queueId: string, timestamp: number): void', () => {
  describe('no changes', () => {
    it('return false', () => {
      const queueId = 'queue-id'
      setRawMessage({
        mq_id: queueId
      , message_id: '1'
      , hash: null
      , payload: null
      , priority: null
      , state: 'drafting'
      , state_updated_at: 1
      , type: null
      })
      setRawStats({
        mq_id: queueId
      , drafting: 1
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      , failed: 0
      })

      const result = DAO.rollbackOutdatedDraftingMessages(queueId, 1)
      const messageExists = hasRawMessage(queueId, '1')
      const rawStatsResult = getRawStats(queueId)

      expect(result).toBeFalse()
      expect(messageExists).toBeTrue()
      expect(rawStatsResult).toMatchObject({
        drafting: 1
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      , failed: 0
      })
    })
  })

  describe('changes', () => {
    it('return true', () => {
      const queueId = 'queue-id'
      setRawMessage({
        mq_id: queueId
      , message_id: '1'
      , hash: null
      , payload: null
      , priority: null
      , state: 'drafting'
      , state_updated_at: 0
      , type: null
      })
      setRawMessage({
        mq_id: queueId
      , message_id: '2'
      , hash: null
      , payload: null
      , priority: null
      , state: 'drafting'
      , state_updated_at: 1
      , type: null
      })
      setRawStats({
        mq_id: queueId
      , drafting: 2
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      , failed: 0
      })

      const result = DAO.rollbackOutdatedDraftingMessages(queueId, 1)
      const message1Exists = hasRawMessage(queueId, '1')
      const message2Exists = hasRawMessage(queueId, '2')
      const rawStatsResult = getRawStats(queueId)

      expect(result).toBeTrue()
      expect(message1Exists).toBeFalse()
      expect(message2Exists).toBeTrue()
      expect(rawStatsResult).toMatchObject({
        drafting: 1
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      , failed: 0
      })
    })
  })
})

describe('rollbackOutdatedOrderedMessages(queueId: string, timestamp: number): void', () => {
  describe('no changes', () => {
    it('return false', () => {
      const queueId = 'queue-id'
      setRawMessage({
        mq_id: queueId
      , message_id: '1'
      , hash: null
      , payload: null
      , priority: null
      , state: 'ordered'
      , state_updated_at: 1
      , type: null
      })
      setRawStats({
        mq_id: queueId
      , drafting: 0
      , waiting: 0
      , ordered: 1
      , active: 0
      , completed: 0
      , failed: 0
      })

      const result = DAO.rollbackOutdatedOrderedMessages(queueId, 1)
      const rawMessageResult = getRawMessage(queueId, '1')
      const rawStatsResult = getRawStats(queueId)

      expect(result).toBeFalse()
      expect(rawMessageResult).toMatchObject({
        state: 'ordered'
      , state_updated_at: 1
      , type: null
      })
      expect(rawStatsResult).toMatchObject({
        drafting: 0
      , waiting: 0
      , ordered: 1
      , active: 0
      , completed: 0
      , failed: 0
      })
    })
  })

  describe('changes', () => {
    it('return true', () => {
      const queueId = 'queue-id'
      setRawMessage({
        mq_id: queueId
      , message_id: '1'
      , hash: null
      , payload: null
      , priority: null
      , state: 'ordered'
      , state_updated_at: 0
      , type: null
      })
      setRawMessage({
        mq_id: queueId
      , message_id: '2'
      , hash: null
      , payload: null
      , priority: null
      , state: 'ordered'
      , state_updated_at: 1
      , type: null
      })
      setRawStats({
        mq_id: queueId
      , drafting: 0
      , waiting: 0
      , ordered: 2
      , active: 0
      , completed: 0
      , failed: 0
      })

      const result = DAO.rollbackOutdatedOrderedMessages(queueId, 1)
      const rawMessage1Result = getRawMessage(queueId, '1')
      const rawMessage2Result = getRawMessage(queueId, '2')
      const rawStatsResult = getRawStats(queueId)

      expect(result).toBeTrue()
      expect(rawMessage1Result).toMatchObject({
        state: 'waiting'
      , state_updated_at: timestamp
      })
      expect(rawMessage2Result).toMatchObject({
        state: 'ordered'
      , state_updated_at: 1
      , type: null
      })
      expect(rawStatsResult).toMatchObject({
        drafting: 0
      , waiting: 1
      , ordered: 1
      , active: 0
      , completed: 0
      , failed: 0
      })
    })
  })
})

describe('rollbackOutdatedActiveMessages(queueId: string, timestamp: number): void', () => {
  describe('no changes', () => {
    it('return false', () => {
      const queueId = 'queue-id'
      setRawMessage({
        mq_id: queueId
      , message_id: '1'
      , hash: null
      , payload: null
      , priority: null
      , state: 'active'
      , state_updated_at: 1
      , type: null
      })
      setRawStats({
        mq_id: queueId
      , drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 1
      , completed: 0
      , failed: 0
      })

      const result = DAO.rollbackOutdatedActiveMessages(queueId, 1)
      const rawMessageResult = getRawMessage(queueId, '1')
      const rawStatsResult = getRawStats(queueId)

      expect(result).toBeFalse()
      expect(rawMessageResult).toMatchObject({
        state: 'active'
      , state_updated_at: 1
      })
      expect(rawStatsResult).toMatchObject({
        drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 1
      , completed: 0
      , failed: 0
      })
    })
  })

  describe('changes', () => {
    it('return true', () => {
      const queueId = 'queue-id'
      setRawMessage({
        mq_id: queueId
      , message_id: '1'
      , hash: null
      , payload: null
      , priority: null
      , state: 'active'
      , state_updated_at: 0
      , type: null
      })
      setRawMessage({
        mq_id: queueId
      , message_id: '2'
      , hash: null
      , payload: null
      , priority: null
      , state: 'active'
      , state_updated_at: 1
      , type: null
      })
      setRawStats({
        mq_id: queueId
      , drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 2
      , completed: 0
      , failed: 0
      })

      const result = DAO.rollbackOutdatedActiveMessages(queueId, 1)
      const rawMessage1Result = getRawMessage(queueId, '1')
      const rawMessage2Result = getRawMessage(queueId, '2')
      const rawStatsResult = getRawStats(queueId)

      expect(result).toBeTrue()
      expect(rawMessage1Result).toMatchObject({
        state: 'waiting'
      , state_updated_at: timestamp
      })
      expect(rawMessage2Result).toMatchObject({
        state: 'active'
      , state_updated_at: 1
      })
      expect(rawStatsResult).toMatchObject({
        drafting: 0
      , waiting: 1
      , ordered: 0
      , active: 1
      , completed: 0
      , failed: 0
      })
    })
  })
})
