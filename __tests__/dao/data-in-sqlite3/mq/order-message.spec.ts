import * as DAO from '@dao/data-in-sqlite3/mq/order-message'
import { resetDatabases, resetEnvironment } from '@test/utils'
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

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('orderMessage(queueId: string, concurrency: number, duration: number, limit: number): string | null', () => {
  describe('exist', () => {
    describe('concurrency', () => {
      describe('not over concurrency', () => {
        it('return a message id and convert state to ordered', () => {
          const queueId = 'queue-id'
          const concurrency = 3
          setRawMessage({
            mq_id: queueId
          , message_id: '1'
          , type: 'type'
          , hash: 'hash'
          , payload: 'payload-1'
          , priority: null
          , state: 'active'
          , state_updated_at: 0
          })
          setRawMessage({
            mq_id: queueId
          , message_id: '2'
          , type: 'type'
          , hash: 'hash'
          , payload: 'payload-2'
          , priority: null
          , state: 'ordered'
          , state_updated_at: 0
          })
          setRawMessage({
            mq_id: queueId
          , message_id: '3'
          , type: 'type'
          , hash: 'hash'
          , payload: 'payload-2'
          , priority: null
          , state: 'waiting'
          , state_updated_at: 0
          })
          setRawStats({
            mq_id: queueId
          , drafting: 0
          , waiting: 1
          , ordered: 1
          , active: 1
          , completed: 0
          })

          const result = DAO.orderMessage(queueId, concurrency, Infinity, Infinity)!
          const message = getRawMessage(queueId, result)
          const stats = getRawStats(queueId)

          expect(result).toBe('3')
          expect(message).toMatchObject({
            state: 'ordered'
          , state_updated_at: timestamp
          })
          expect(stats).toMatchObject({
            drafting: 0
          , waiting: 0
          , ordered: 2
          , active: 1
          , completed: 0
          })
        })
      })

      describe('over concurrency', () => {
        it('return null', () => {
          const queueId = 'queue-id'
          const concurrency = 2
          setRawMessage({
            mq_id: queueId
          , message_id: '1'
          , type: 'type'
          , hash: 'hash'
          , payload: 'payload-1'
          , priority: null
          , state: 'active'
          , state_updated_at: 0
          })
          setRawMessage({
            mq_id: queueId
          , message_id: '2'
          , type: 'type'
          , hash: 'hash'
          , payload: 'payload-2'
          , priority: null
          , state: 'ordered'
          , state_updated_at: 0
          })
          setRawMessage({
            mq_id: queueId
          , message_id: '3'
          , type: 'type'
          , hash: 'hash'
          , payload: 'payload-2'
          , priority: null
          , state: 'waiting'
          , state_updated_at: 0
          })
          setRawStats({
            mq_id: queueId
          , drafting: 0
          , waiting: 1
          , ordered: 1
          , active: 1
          , completed: 0
          })

          const result = DAO.orderMessage(queueId, concurrency, Infinity, Infinity)!
          const message = getRawMessage(queueId, '3')
          const stats = getRawStats(queueId)

          expect(result).toBeNull()
          expect(message).toMatchObject({
            state: 'waiting'
          , state_updated_at: 0
          })
          expect(stats).toMatchObject({
            drafting: 0
          , waiting: 1
          , ordered: 1
          , active: 1
          , completed: 0
          })
        })
      })
    })

    describe('throttle', () => {
      describe('not over limit', () => {
        describe('same priority, diff state_updated_at', () => {
          it('return a message id and convert state to ordered', () => {
            const queueId = 'queue-id'
            const duration = 100
            const limit = 1
            setRawMessage({
              mq_id: queueId
            , message_id: '1'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload-1'
            , priority: null
            , state: 'waiting'
            , state_updated_at: 0
            })
            setRawMessage({
              mq_id: queueId
            , message_id: '2'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload'
            , priority: null
            , state: 'waiting'
            , state_updated_at: 1
            })
            setRawMessage({
              mq_id: queueId
            , message_id: '3'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload'
            , priority: null
            , state: 'waiting'
            , state_updated_at: 2
            })
            setRawStats({
              mq_id: queueId
            , drafting: 0
            , waiting: 3
            , ordered: 0
            , active: 0
            , completed: 0
            })

            const result = DAO.orderMessage(queueId, Infinity, duration, limit)!
            const message = getRawMessage(queueId, result)
            const stats = getRawStats(queueId)

            expect(result).toBe('1')
            expect(message).toMatchObject({
              state: 'ordered'
            , state_updated_at: timestamp
            })
            expect(stats).toMatchObject({
              drafting: 0
            , waiting: 2
            , ordered: 1
            , active: 0
            , completed: 0
            })
          })
        })

        describe('same state_updated_at, diff priority', () => {
          it('return a message id and convert state to ordered', () => {
            const queueId = 'queue-id'
            const duration = 100
            const limit = 1
            setRawMessage({
              mq_id: queueId
            , message_id: '1'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload-1'
            , priority: null
            , state: 'waiting'
            , state_updated_at: 0
            })
            setRawMessage({
              mq_id: queueId
            , message_id: '2'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload'
            , priority: 0
            , state: 'waiting'
            , state_updated_at: 0
            })
            setRawMessage({
              mq_id: queueId
            , message_id: '3'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload'
            , priority: 1
            , state: 'waiting'
            , state_updated_at: 0
            })
            setRawStats({
              mq_id: queueId
            , drafting: 0
            , waiting: 3
            , ordered: 0
            , active: 0
            , completed: 0
            })

            const result = DAO.orderMessage(queueId, Infinity, duration, limit)!
            const message = getRawMessage(queueId, result)
            const stats = getRawStats(queueId)

            expect(result).toBe('2')
            expect(message).toMatchObject({
              state: 'ordered'
            , state_updated_at: timestamp
            })
            expect(stats).toMatchObject({
              drafting: 0
            , waiting: 2
            , ordered: 1
            , active: 0
            , completed: 0
            })
          })
        })
      })

      describe('over limit', () => {
        describe('new cycle', () => {
          it('return a message id and convert state to ordered', () => {
            const queueId = 'queue-id'
            const duration = 100
            const limit = 1
            setRawMessage({
              mq_id: queueId
            , message_id: '1'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload-1'
            , priority: null
            , state: 'ordered'
            , state_updated_at: 0
            })
            setRawMessage({
              mq_id: queueId
            , message_id: '2'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload-2'
            , priority: null
            , state: 'waiting'
            , state_updated_at: 0
            })
            setRawStats({
              mq_id: queueId
            , drafting: 0
            , waiting: 1
            , ordered: 1
            , active: 0
            , completed: 0
            })
            setRawThrottle({
              mq_id: queueId
            , cycle_start_time: 0
            , count: 1
            })

            const result = DAO.orderMessage(queueId, Infinity, duration, limit)!
            const message = getRawMessage(queueId, result)
            const stats = getRawStats(queueId)
            const throttle = getRawThrottle(queueId)

            expect(result).toBe('2')
            expect(message).toMatchObject({
              state: 'ordered'
            , state_updated_at: timestamp
            })
            expect(stats).toMatchObject({
              drafting: 0
            , waiting: 0
            , ordered: 2
            , active: 0
            , completed: 0
            })
            expect(throttle).toMatchObject({
              count: 1
            })
            expect(Math.abs(timestamp - throttle!.cycle_start_time)).toBeLessThanOrEqual(duration)
          })
        })

        describe('same cycle', () => {
          it('return null', () => {
            const queueId = 'queue-id'
            const duration = 100
            const limit = 1
            setRawMessage({
              mq_id: queueId
            , message_id: '1'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload-1'
            , priority: null
            , state: 'ordered'
            , state_updated_at: 0
            })
            setRawMessage({
              mq_id: queueId
            , message_id: '2'
            , type: 'type'
            , hash: 'hash'
            , payload: 'payload-2'
            , priority: null
            , state: 'waiting'
            , state_updated_at: 0
            })
            setRawStats({
              mq_id: queueId
            , drafting: 0
            , waiting: 1
            , ordered: 1
            , active: 0
            , completed: 0
            })
            setRawThrottle({
              mq_id: queueId
            , cycle_start_time: timestamp
            , count: 1
            })

            const result = DAO.orderMessage(queueId, Infinity, duration, limit)

            expect(result).toBeNull()
          })
        })
      })
    })
  })

  describe('not exist', () => {
    it('return null', () => {
      const queueId = 'queue-id'
      const duration = 100
      const limit = 1

      const result = DAO.orderMessage(queueId, Infinity, duration, limit)

      expect(result).toBeNull()
    })
  })
})
