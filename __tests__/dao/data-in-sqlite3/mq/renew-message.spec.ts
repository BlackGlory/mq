import * as DAO from '@dao/data-in-sqlite3/mq/renew-message'
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

describe('renewMessage(queueId: string, messageId: string): void', () => {
  describe('state: failed', () => {
    it('convert state to waiting', () => {
      const queueId = 'queue-id'
      const messageId = 'message-id'
      setRawMessage({
        mq_id: queueId
      , message_id: messageId
      , hash: 'hash'
      , payload: 'payload'
      , priority: null
      , state: 'failed'
      , state_updated_at: 0
      , type: 'type'
      })
      setRawStats({
        mq_id: queueId
      , drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      , failed: 1
      })

      const result = DAO.renewMessage(queueId, messageId)
      const exists = hasRawMessage(queueId, messageId)
      const stats = getRawStats(queueId)

      expect(result).toBeUndefined()
      expect(exists).toBeTrue()
      expect(stats).toMatchObject({
        drafting: 0
      , waiting: 1
      , ordered: 0
      , active: 0
      , completed: 0
      , failed: 0
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

      const err = getError(() => DAO.renewMessage(queueId, messageId))

      expect(err).toBeInstanceOf(BadMessageState)
    })
  })
})