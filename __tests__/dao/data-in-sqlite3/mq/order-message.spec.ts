import * as DAO from '@dao/data-in-sqlite3/mq/order-message.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawMessage, setRawStats, getRawMessage, getRawStats } from './utils.js'
import { setMockTimestamp, clearMock, getTimestamp } from '@dao/data-in-sqlite3/mq/utils/get-timestamp.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

beforeEach(() => setMockTimestamp(Date.now()))
afterEach(clearMock)

describe('orderMessage(namespace: string, concurrency: number): string | null', () => {
  describe('message does not exist', () => {
    it('return null', () => {
      const namespace = 'namespace'
      const duration = 100
      const limit = 1

      const result = DAO.orderMessage(namespace, Infinity)

      expect(result).toBeNull()
    })
  })

  describe('message exists', () => {
    describe('concurrency', () => {
      describe('not over concurrency', () => {
        it('return a message id and convert state to ordered', () => {
          const namespace = 'namespace'
          const concurrency = 3
          setRawMessage({
            namespace
          , id: '1'
          , type: 'type'
          , hash: 'hash'
          , payload: 'payload-1'
          , priority: null
          , state: 'active'
          , state_updated_at: 0
          })
          setRawMessage({
            namespace
          , id: '2'
          , type: 'type'
          , hash: 'hash'
          , payload: 'payload-2'
          , priority: null
          , state: 'ordered'
          , state_updated_at: 0
          })
          setRawMessage({
            namespace
          , id: '3'
          , type: 'type'
          , hash: 'hash'
          , payload: 'payload-3'
          , priority: null
          , state: 'waiting'
          , state_updated_at: 0
          })
          setRawMessage({
            namespace
          , id: '4'
          , type: 'type'
          , hash: 'hash'
          , payload: 'payload-4'
          , priority: null
          , state: 'waiting'
          , state_updated_at: 0
          })
          setRawStats({
            namespace
          , drafting: 0
          , waiting: 2
          , ordered: 1
          , active: 1
          , completed: 0
          , failed: 0
          })

          const result = DAO.orderMessage(namespace, concurrency)!
          const rawMessageResult = getRawMessage(namespace, result)
          const rawStatsResult = getRawStats(namespace)

          expect(result).toBe('3')
          expect(rawMessageResult).toMatchObject({
            state: 'ordered'
          , state_updated_at: getTimestamp()
          })
          expect(rawStatsResult).toMatchObject({
            drafting: 0
          , waiting: 1
          , ordered: 2
          , active: 1
          , completed: 0
          , failed: 0
          })
        })
      })

      describe('over concurrency', () => {
        it('return null', () => {
          const namespace = 'namespace'
          const concurrency = 2
          setRawMessage({
            namespace
          , id: '1'
          , type: 'type'
          , hash: 'hash'
          , payload: 'payload-1'
          , priority: null
          , state: 'active'
          , state_updated_at: 0
          })
          setRawMessage({
            namespace
          , id: '2'
          , type: 'type'
          , hash: 'hash'
          , payload: 'payload-2'
          , priority: null
          , state: 'ordered'
          , state_updated_at: 0
          })
          setRawMessage({
            namespace
          , id: '3'
          , type: 'type'
          , hash: 'hash'
          , payload: 'payload-2'
          , priority: null
          , state: 'waiting'
          , state_updated_at: 0
          })
          setRawStats({
            namespace
          , drafting: 0
          , waiting: 1
          , ordered: 1
          , active: 1
          , completed: 0
          , failed: 0
          })

          const result = DAO.orderMessage(namespace, concurrency)!
          const rawMessageResult = getRawMessage(namespace, '3')
          const rawStatsResult = getRawStats(namespace)

          expect(result).toBeNull()
          expect(rawMessageResult).toMatchObject({
            state: 'waiting'
          , state_updated_at: 0
          })
          expect(rawStatsResult).toMatchObject({
            drafting: 0
          , waiting: 1
          , ordered: 1
          , active: 1
          , completed: 0
          , failed: 0
          })
        })
      })
    })
  })
})
