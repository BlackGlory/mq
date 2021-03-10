import * as DAO from '@dao/data-in-sqlite3/mq/get-message'
import { NotFound, BadMessageState } from '@dao/data-in-sqlite3/mq/error'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setRawMessage, getRawMessage, setRawStats, getRawStats } from './utils'
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

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getMessage(queueId: string, messageId: string): IMessage', () => {
  describe('message does not exist', () => {
    it('throw NotFound', () => {
      const queueId = 'queue-id'
      const messageId = 'message-id'

      const err = getError(() => DAO.getMessage(queueId, messageId))

      expect(err).toBeInstanceOf(NotFound)
    })
  })

  describe('message exists', () => {
    describe('state: ordered', () => {
      it('convert state to active and return IMessage', () => {
        const queueId = 'queue-id'
        const messageId = 'message-id'
        setRawMessage({
          mq_id: queueId
        , message_id: messageId
        , type: 'type'
        , payload: 'payload'
        , hash: 'hash'
        , priority: null
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

        const result = DAO.getMessage(queueId, messageId)
        const rawMessageResult = getRawMessage(queueId, messageId)
        const rawStatsResult = getRawStats(queueId)

        expect(result).toEqual({
          type: 'type'
        , payload: 'payload'
        , priority: null
        })
        expect(rawMessageResult).toMatchObject({
          state: 'active'
        , state_updated_at: timestamp
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

    describe('state: drafting', () => {
      it('throw BadMessageState', () => {
        const queueId = 'queue-id'
        const messageId = 'message-id'
        setRawMessage({
          mq_id: queueId
        , message_id: messageId
        , type: null
        , payload: null
        , hash: null
        , priority: null
        , state: 'drafting'
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

        const err = getError(() => DAO.getMessage(queueId, messageId))

        expect(err).toBeInstanceOf(BadMessageState)
      })
    })

    describe('other states', () => {
      it('return IMessage', () => {
        const queueId = 'queue-id'
        const messageId = 'message-id'
        setRawMessage({
          mq_id: queueId
        , message_id: messageId
        , type: 'type'
        , payload: 'payload'
        , hash: 'hash'
        , priority: null
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

        const result = DAO.getMessage(queueId, messageId)
        const rawMessageResult = getRawMessage(queueId, messageId)
        const rawStatsResult = getRawStats(queueId)

        expect(result).toEqual({
          type: 'type'
        , payload: 'payload'
        , priority: null
        })
        expect(rawMessageResult).toMatchObject({
          state: 'waiting'
        , state_updated_at: 0
        })
        expect(rawStatsResult).toMatchObject({
          drafting: 0
        , waiting: 1
        , ordered: 0
        , active: 0
        , completed: 0
        , failed: 0
        })
      })
    })
  })
})
