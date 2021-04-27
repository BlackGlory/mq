import * as DAO from '@dao/data-in-sqlite3/mq/order-message'
import { initializeDatabases, clearDatabases } from '@test/utils'
import {
  setRawMessage, setRawStats, setRawThrottle
, getRawMessage, getRawStats, getRawThrottle
} from './utils'
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

describe('orderMessage(namespace: string, concurrency: number, duration: number, limit: number): string | null', () => {
  describe('message does not exist', () => {
    it('return null', () => {
      const namespace = 'namespace'
      const duration = 100
      const limit = 1

      const result = DAO.orderMessage(namespace, Infinity, duration, limit)

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

          const result = DAO.orderMessage(namespace, concurrency, Infinity, Infinity)!
          const rawMessageResult = getRawMessage(namespace, result)
          const rawStatsResult = getRawStats(namespace)

          expect(result).toBe('3')
          expect(rawMessageResult).toMatchObject({
            state: 'ordered'
          , state_updated_at: timestamp
          })
          expect(rawStatsResult).toMatchObject({
            drafting: 0
          , waiting: 0
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

          const result = DAO.orderMessage(namespace, concurrency, Infinity, Infinity)!
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

    describe('throttle', () => {
      describe('not over limit', () => {
        describe('same priority, diff state_updated_at', () => {
          it('return a message id and convert state to ordered', () => {
            const namespace = 'namespace'
            const duration = 100
            const limit = 1
            setRawMessage({
              namespace
            , id: '1'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload-1'
            , priority: null
            , state: 'waiting'
            , state_updated_at: 0
            })
            setRawMessage({
              namespace
            , id: '2'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload'
            , priority: null
            , state: 'waiting'
            , state_updated_at: 1
            })
            setRawMessage({
              namespace
            , id: '3'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload'
            , priority: null
            , state: 'waiting'
            , state_updated_at: 2
            })
            setRawStats({
              namespace
            , drafting: 0
            , waiting: 3
            , ordered: 0
            , active: 0
            , completed: 0
            , failed: 0
            })

            const result = DAO.orderMessage(namespace, Infinity, duration, limit)!
            const rawMessageResult = getRawMessage(namespace, result)
            const rawStatsResult = getRawStats(namespace)

            expect(result).toBe('1')
            expect(rawMessageResult).toMatchObject({
              state: 'ordered'
            , state_updated_at: timestamp
            })
            expect(rawStatsResult).toMatchObject({
              drafting: 0
            , waiting: 2
            , ordered: 1
            , active: 0
            , completed: 0
            , failed: 0
            })
          })
        })

        describe('same state_updated_at, diff priority', () => {
          it('return a message id and convert state to ordered', () => {
            const namespace = 'namespace'
            const duration = 100
            const limit = 1
            setRawMessage({
              namespace
            , id: '1'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload-1'
            , priority: null
            , state: 'waiting'
            , state_updated_at: 0
            })
            setRawMessage({
              namespace
            , id: '2'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload'
            , priority: 0
            , state: 'waiting'
            , state_updated_at: 0
            })
            setRawMessage({
              namespace
            , id: '3'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload'
            , priority: 1
            , state: 'waiting'
            , state_updated_at: 0
            })
            setRawStats({
              namespace
            , drafting: 0
            , waiting: 3
            , ordered: 0
            , active: 0
            , completed: 0
            , failed: 0
            })

            const result = DAO.orderMessage(namespace, Infinity, duration, limit)!
            const rawMessageResult = getRawMessage(namespace, result)
            const rawStatsResult = getRawStats(namespace)

            expect(result).toBe('2')
            expect(rawMessageResult).toMatchObject({
              state: 'ordered'
            , state_updated_at: timestamp
            })
            expect(rawStatsResult).toMatchObject({
              drafting: 0
            , waiting: 2
            , ordered: 1
            , active: 0
            , completed: 0
            , failed: 0
            })
          })
        })
      })

      describe('over limit', () => {
        describe('new cycle', () => {
          it('return a message id and convert state to ordered', () => {
            const namespace = 'namespace'
            const duration = 100
            const limit = 1
            setRawMessage({
              namespace
            , id: '1'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload-1'
            , priority: null
            , state: 'ordered'
            , state_updated_at: 0
            })
            setRawMessage({
              namespace
            , id: '2'
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
            , active: 0
            , completed: 0
            , failed: 0
            })
            setRawThrottle({
              namespace
            , cycle_start_time: 0
            , count: 1
            })

            const result = DAO.orderMessage(namespace, Infinity, duration, limit)!
            const rawMessageResult = getRawMessage(namespace, result)
            const rawStatsResult = getRawStats(namespace)
            const rawThrottleResult = getRawThrottle(namespace)

            expect(result).toBe('2')
            expect(rawMessageResult).toMatchObject({
              state: 'ordered'
            , state_updated_at: timestamp
            })
            expect(rawStatsResult).toMatchObject({
              drafting: 0
            , waiting: 0
            , ordered: 2
            , active: 0
            , completed: 0
            , failed: 0
            })
            expect(rawThrottleResult).toMatchObject({
              count: 1
            })
            expect(Math.abs(timestamp - rawThrottleResult!.cycle_start_time)).toBeLessThanOrEqual(duration)
          })
        })

        describe('same cycle', () => {
          it('return null', () => {
            const namespace = 'namespace'
            const duration = 100
            const limit = 1
            setRawMessage({
              namespace
            , id: '1'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload-1'
            , priority: null
            , state: 'ordered'
            , state_updated_at: 0
            })
            setRawMessage({
              namespace
            , id: '2'
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
            , active: 0
            , completed: 0
            , failed: 0
            })
            setRawThrottle({
              namespace
            , cycle_start_time: timestamp
            , count: 1
            })

            const result = DAO.orderMessage(namespace, Infinity, duration, limit)

            expect(result).toBeNull()
          })
        })
      })
    })
  })
})
