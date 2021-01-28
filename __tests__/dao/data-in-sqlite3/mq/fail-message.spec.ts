import * as DAO from '@dao/data-in-sqlite3/mq/fail-message'
import { BadMessageState } from '@dao/data-in-sqlite3/mq/error'
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

describe('failMessage(queueId: string, messageId: string): void', () => {
  describe('state: active', () => {
    it('convert state to failed', () => {
      const queueId = 'queue-id'
      const messageId = 'message-id'
      setRawMessage({
        mq_id: queueId
      , message_id: messageId
      , hash: 'hash'
      , payload: 'payload'
      , priority: null
      , state: 'active'
      , state_updated_at: 0
      , type: 'type'
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

      const result = DAO.failMessage(queueId, messageId)
      const exists = hasRawMessage(queueId, messageId)
      const stats = getRawStats(queueId)

      expect(result).toBeUndefined()
      expect(exists).toBeTrue()
      expect(stats).toMatchObject({
        drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      , failed: 1
      })
    })
  })

  describe('other states', () => {
    it('throw BadMessageState', async () => {
      const queueId = 'queue-id'
      const messageId = 'message-id'
      setRawMessage({
        mq_id: queueId
      , message_id: messageId
      , hash: 'hash'
      , payload: 'payload'
      , priority: null
      , state: 'waiting'
      , state_updated_at: 0
      , type: 'type'
      })
      setRawStats({
        mq_id: queueId
      , drafting: 0
      , waiting: 1
      , ordered: 0
      , active: 0
      , completed: 0
      , failed: 0
      })

      const err = getError(() => DAO.failMessage(queueId, messageId))

      expect(err).toBeInstanceOf(BadMessageState)
    })
  })
})
