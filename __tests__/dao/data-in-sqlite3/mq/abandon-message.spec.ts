import * as DAO from '@dao/data-in-sqlite3/mq/abandon-message'
import { NotFound } from '@dao/data-in-sqlite3/mq/error'
import { reset } from '@test/utils'
import { setMinimalRawMessage, setRawStats, getRawStats, hasRawMessage } from './utils'
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

beforeEach(reset)

describe('abandonMessage(queueId: string, messageId: string): void', () => {
  describe('message does not exist', () => {
    it('throw NotFound', () => {
      const queueId = 'queue-id'
      const messageId = 'message-id'

      const err = getError(() => DAO.abandonMessage(queueId, messageId))

      expect(err).toBeInstanceOf(NotFound)
    })
  })

  describe('message exists', () => {
    describe('state: drafting', () => {
      it('delete message', () => {
        const queueId = 'queue-id'
        const messageId = 'message-id'
        setMinimalRawMessage({
          mq_id: queueId
        , message_id: messageId
        , state: 'drafting'
        , state_updated_at: 0
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

        const result = DAO.abandonMessage(queueId, messageId)
        const exists = hasRawMessage(queueId, messageId)
        const rawStatsResult = getRawStats(queueId)

        expect(result).toBeUndefined()
        expect(exists).toBeFalse()
        expect(rawStatsResult).toMatchObject({
          drafting: 0
        , waiting: 0
        , ordered: 0
        , active: 0
        , completed: 0
        , failed: 0
        })
      })
    })

    describe('state: waiting', () => {
      it('delete message', () => {
        const queueId = 'queue-id'
        const messageId = 'message-id'
        setMinimalRawMessage({
          mq_id: queueId
        , message_id: messageId
        , state: 'waiting'
        , state_updated_at: 0
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

        const result = DAO.abandonMessage(queueId, messageId)
        const exists = hasRawMessage(queueId, messageId)
        const rawStatsResult = getRawStats(queueId)

        expect(result).toBeUndefined()
        expect(exists).toBeFalse()
        expect(rawStatsResult).toMatchObject({
          drafting: 0
        , waiting: 0
        , ordered: 0
        , active: 0
        , completed: 0
        , failed: 0
        })
      })
    })

    describe('state: ordered', () => {
      it('delete message', () => {
        const queueId = 'queue-id'
        const messageId = 'message-id'
        setMinimalRawMessage({
          mq_id: queueId
        , message_id: messageId
        , state: 'ordered'
        , state_updated_at: 0
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

        const result = DAO.abandonMessage(queueId, messageId)
        const exists = hasRawMessage(queueId, messageId)
        const rawStatsResult = getRawStats(queueId)

        expect(result).toBeUndefined()
        expect(exists).toBeFalse()
        expect(rawStatsResult).toMatchObject({
          drafting: 0
        , waiting: 0
        , ordered: 0
        , active: 0
        , completed: 0
        , failed: 0
        })
      })
    })

    describe('state: active', () => {
      it('delete message', () => {
        const queueId = 'queue-id'
        const messageId = 'message-id'
        setMinimalRawMessage({
          mq_id: queueId
        , message_id: messageId
        , state: 'active'
        , state_updated_at: 0
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

        const result = DAO.abandonMessage(queueId, messageId)
        const exists = hasRawMessage(queueId, messageId)
        const rawStatsResult = getRawStats(queueId)

        expect(result).toBeUndefined()
        expect(exists).toBeFalse()
        expect(rawStatsResult).toMatchObject({
          drafting: 0
        , waiting: 0
        , ordered: 0
        , active: 0
        , completed: 0
        , failed: 0
        })
      })
    })

    describe('state: failed', () => {
      it('delete message', () => {
        const queueId = 'queue-id'
        const messageId = 'message-id'
        setMinimalRawMessage({
          mq_id: queueId
        , message_id: messageId
        , state: 'failed'
        , state_updated_at: 0
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

        const result = DAO.abandonMessage(queueId, messageId)
        const exists = hasRawMessage(queueId, messageId)
        const rawStatsResult = getRawStats(queueId)

        expect(result).toBeUndefined()
        expect(exists).toBeFalse()
        expect(rawStatsResult).toMatchObject({
          drafting: 0
        , waiting: 0
        , ordered: 0
        , active: 0
        , completed: 0
        , failed: 0
        })
      })
    })
  })
})
