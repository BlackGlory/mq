import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import * as DAO from '@dao/data/mq/set-message.js'
import { hash } from '@dao/data/mq/utils/hash.js'
import { BadMessageState, DuplicatePayload, NotFound } from '@dao/data/mq/error.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawMessage, setRawStats, getRawMessage, getRawStats } from './utils.js'
import { getError } from 'return-style'
import { assert, isString } from '@blackglory/prelude'
import { _setMockedTimestamp, _clearMockedTimestamp, getTimestamp } from '@dao/data/mq/utils/get-timestamp.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

beforeEach(() => _setMockedTimestamp(Date.now()))
afterEach(_clearMockedTimestamp)

describe(`
  setMessage(
    namespace: string
  , messageId: string
  , type: string
  , payload: string
  , unique?: boolean
  ): void
`, () => {
  describe('message does not exist', () => {
    it('throw NotFound', () => {
      const namespace = 'namespace'
      const messageId = 'message-id'
      const type = 'text/plain'
      const payload = 'payload'

      const err = getError(() => DAO.setMessage(namespace, messageId, type, payload))

      expect(err).toBeInstanceOf(NotFound)
    })
  })

  describe('message exists', () => {
    describe('unique', () => {
      describe('duplicate', () => {
        it('throw DuplicatePayload', () => {
          const namespace = 'namespace'
          const messageId = 'message-id'
          const type = 'text/plain'
          const payload = 'payload'
          setRawStats({
            namespace
          , drafting: 1
          , waiting: 1
          , ordered: 0
          , active: 0
          , completed: 0
          , failed: 0
          })
          setRawMessage({
            namespace
          , id: 'old-message'
          , priority: null
          , type: 'text/plain'
          , payload
          , hash: hash(payload)
          , state: 'waiting'
          , state_updated_at: 0
          })
          setRawMessage({
            namespace
          , id: messageId
          , priority: null
          , type: null
          , payload: null
          , hash: null
          , state: 'drafting'
          , state_updated_at: 0
          })

          const result = getError(() => DAO.setMessage(namespace, messageId, type, payload, true))
          const rawMessageResult = getRawMessage(namespace, messageId)
          const rawStatsResult = getRawStats(namespace)

          expect(result).toBeInstanceOf(DuplicatePayload)
          expect(rawMessageResult).toMatchObject({
            priority: null
          , type: null
          , payload: null
          , hash: null
          , state: 'drafting'
          , state_updated_at: 0
          })
          expect(rawStatsResult).toMatchObject({
            drafting: 1
          , waiting: 1
          , ordered: 0
          , active: 0
          , completed: 0
          , failed: 0
          })
        })
      })

      describe('not duplicate', () => {
        it('update message and convert state to waiting', () => {
          const namespace = 'namespace'
          const messageId = 'message-id'
          const type = 'text/plain'
          const payload = 'payload'
          setRawStats({
            namespace
          , drafting: 1
          , waiting: 1
          , ordered: 0
          , active: 0
          , completed: 0
          , failed: 0
          })
          setRawMessage({
            namespace
          , id: 'old-message'
          , priority: null
          , type: 'text/plain'
          , payload: 'old-payload'
          , hash: hash('old-payload')
          , state: 'waiting'
          , state_updated_at: 0
          })
          setRawMessage({
            namespace
          , id: messageId
          , priority: null
          , type: null
          , payload: null
          , hash: null
          , state: 'drafting'
          , state_updated_at: 0
          })

          const result = DAO.setMessage(namespace, messageId, type, payload, true)
          const rawMessageResult = getRawMessage(namespace, messageId)
          const rawStatsResult = getRawStats(namespace)

          expect(result).toBeUndefined()
          expect(rawMessageResult).toMatchObject({
            priority: null
          , type
          , payload
            // eslint-disable-next-line
          , hash: expect.any(String)
          , state: 'waiting'
          , state_updated_at: getTimestamp()
          })
          expect(rawStatsResult).toMatchObject({
            drafting: 0
          , waiting: 2
          , ordered: 0
          , active: 0
          , completed: 0
          , failed: 0
          })
        })
      })
    })

    describe('state: drafting', () => {
      it('update message and convert state to waiting', () => {
        const namespace = 'namespace'
        const messageId = 'message-id'
        const type = 'text/plain'
        const payload = 'payload'
        setRawStats({
          namespace
        , drafting: 1
        , waiting: 0
        , ordered: 0
        , active: 0
        , completed: 0
        , failed: 0
        })
        setRawMessage({
          namespace
        , id: messageId
        , priority: null
        , type: null
        , payload: null
        , hash: null
        , state: 'drafting'
        , state_updated_at: 0
        })

        const result = DAO.setMessage(namespace, messageId, type, payload)
        const rawMessageResult = getRawMessage(namespace, messageId)
        const rawStatsResult = getRawStats(namespace)

        expect(result).toBeUndefined()
        expect(rawMessageResult).toMatchObject({
          priority: null
        , type
        , payload
          // eslint-disable-next-line
        , hash: expect.any(String)
        , state: 'waiting'
        , state_updated_at: getTimestamp()
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

    describe('state: waiting', () => {
      it('update message', () => {
        const namespace = 'namespace'
        const messageId = 'message-id'
        const type = 'text/plain'
        const payload = 'payload'
        const oldHash = 'old-hash'
        setRawStats({
          namespace
        , drafting: 0
        , waiting: 1
        , ordered: 0
        , active: 0
        , completed: 0
        , failed: 0
        })
        setRawMessage({
          namespace
        , id: messageId
        , priority: null
        , type: 'old-type'
        , payload: 'old-payload'
        , hash: oldHash
        , state: 'waiting'
        , state_updated_at: 0
        })

        const result = DAO.setMessage(namespace, messageId, type, payload)
        const rawMessageResult = getRawMessage(namespace, messageId)
        const rawStatsResult = getRawStats(namespace)

        expect(result).toBeUndefined()
        expect(rawMessageResult).toMatchObject({
          priority: null
        , type
        , payload
        , state: 'waiting'
        , state_updated_at: 0
        })
        assert(isString(rawMessageResult!.hash), 'hash is not a string')
        expect(rawMessageResult!.hash).not.toBe(oldHash)
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

    describe('other states', () => {
      it('throw BadMessageState', () => {
        const namespace = 'namespace'
        const messageId = 'message-id'
        const type = 'text/plain'
        const payload = 'payload'
        setRawStats({
          namespace
        , drafting: 0
        , waiting: 0
        , ordered: 0
        , active: 1
        , completed: 0
        , failed: 0
        })
        setRawMessage({
          namespace
        , id: messageId
        , priority: null
        , type: 'old-type'
        , payload: 'old-payload'
        , hash: 'old-hash'
        , state: 'active'
        , state_updated_at: 0
        })

        const err = getError(() => DAO.setMessage(namespace, messageId, type, payload))
        const rawMessageResult = getRawMessage(namespace, messageId)
        const rawStatsResult = getRawStats(namespace)

        expect(err).toBeInstanceOf(BadMessageState)
        expect(rawMessageResult).toMatchObject({
          priority: null
        , type: 'old-type'
        , payload: 'old-payload'
        , state: 'active'
        , hash: 'old-hash'
        , state_updated_at: 0
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
  })
})
