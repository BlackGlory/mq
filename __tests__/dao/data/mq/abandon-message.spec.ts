import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import * as DAO from '@dao/data/mq/abandon-message.js'
import { NotFound } from '@dao/data/mq/error.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setMinimalRawMessage, setRawStats, getRawStats, hasRawMessage } from './utils.js'
import { getError } from 'return-style'
import { _setMockedTimestamp, _clearMockedTimestamp } from '@dao/data/mq/utils/get-timestamp.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

beforeEach(() => _setMockedTimestamp(Date.now()))
afterEach(_clearMockedTimestamp)

describe('abandonMessage(namespace: string, messageId: string): void', () => {
  describe('message does not exist', () => {
    it('throw NotFound', () => {
      const namespace = 'namespace'
      const messageId = 'message-id'

      const err = getError(() => DAO.abandonMessage(namespace, messageId))

      expect(err).toBeInstanceOf(NotFound)
    })
  })

  describe('message exists', () => {
    describe('state: drafting', () => {
      it('delete message', () => {
        const namespace = 'namespace'
        const messageId = 'message-id'
        setMinimalRawMessage({
          namespace
        , id: messageId
        , state: 'drafting'
        , state_updated_at: 0
        })
        setRawStats({
          namespace
        , drafting: 1
        , waiting: 0
        , ordered: 0
        , active: 0
        , completed: 0
        , failed: 0
        })

        const result = DAO.abandonMessage(namespace, messageId)
        const exists = hasRawMessage(namespace, messageId)
        const rawStatsResult = getRawStats(namespace)

        expect(result).toBeUndefined()
        expect(exists).toBe(false)
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
        const namespace = 'namespace'
        const messageId = 'message-id'
        setMinimalRawMessage({
          namespace
        , id: messageId
        , state: 'waiting'
        , state_updated_at: 0
        })
        setRawStats({
          namespace
        , drafting: 0
        , waiting: 1
        , ordered: 0
        , active: 0
        , completed: 0
        , failed: 0
        })

        const result = DAO.abandonMessage(namespace, messageId)
        const exists = hasRawMessage(namespace, messageId)
        const rawStatsResult = getRawStats(namespace)

        expect(result).toBeUndefined()
        expect(exists).toBe(false)
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
        const namespace = 'namespace'
        const messageId = 'message-id'
        setMinimalRawMessage({
          namespace
        , id: messageId
        , state: 'ordered'
        , state_updated_at: 0
        })
        setRawStats({
          namespace
        , drafting: 0
        , waiting: 0
        , ordered: 1
        , active: 0
        , completed: 0
        , failed: 0
        })

        const result = DAO.abandonMessage(namespace, messageId)
        const exists = hasRawMessage(namespace, messageId)
        const rawStatsResult = getRawStats(namespace)

        expect(result).toBeUndefined()
        expect(exists).toBe(false)
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
        const namespace = 'namespace'
        const messageId = 'message-id'
        setMinimalRawMessage({
          namespace
        , id: messageId
        , state: 'active'
        , state_updated_at: 0
        })
        setRawStats({
          namespace
        , drafting: 0
        , waiting: 0
        , ordered: 0
        , active: 1
        , completed: 0
        , failed: 0
        })

        const result = DAO.abandonMessage(namespace, messageId)
        const exists = hasRawMessage(namespace, messageId)
        const rawStatsResult = getRawStats(namespace)

        expect(result).toBeUndefined()
        expect(exists).toBe(false)
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
        const namespace = 'namespace'
        const messageId = 'message-id'
        setMinimalRawMessage({
          namespace
        , id: messageId
        , state: 'failed'
        , state_updated_at: 0
        })
        setRawStats({
          namespace
        , drafting: 0
        , waiting: 0
        , ordered: 0
        , active: 0
        , completed: 0
        , failed: 1
        })

        const result = DAO.abandonMessage(namespace, messageId)
        const exists = hasRawMessage(namespace, messageId)
        const rawStatsResult = getRawStats(namespace)

        expect(result).toBeUndefined()
        expect(exists).toBe(false)
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
