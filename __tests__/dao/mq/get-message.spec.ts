import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import * as DAO from '@dao/mq/get-message.js'
import { NotFound, BadMessageState } from '@dao/mq/error.js'
import { initializeDatabases, clearDatabase } from '@test/utils.js'
import { setRawMessage, getRawMessage, setRawStats, getRawStats } from './utils.js'
import { getError } from 'return-style'
import { _setMockedTimestamp, _clearMockedTimestamp, getTimestamp } from '@dao/mq/utils/get-timestamp.js'

beforeEach(initializeDatabases)
afterEach(clearDatabase)

beforeEach(() => _setMockedTimestamp(Date.now()))
afterEach(_clearMockedTimestamp)

describe('getMessage(namespace: string, messageId: string): IMessage', () => {
  describe('message does not exist', () => {
    it('throw NotFound', () => {
      const namespace = 'namespace'
      const messageId = 'message-id'

      const err = getError(() => DAO.getMessage(namespace, messageId))

      expect(err).toBeInstanceOf(NotFound)
    })
  })

  describe('message exists', () => {
    describe('state: ordered', () => {
      it('convert state to active and return IMessage', () => {
        const namespace = 'namespace'
        const messageId = 'message-id'
        setRawMessage({
          namespace
        , id: messageId
        , type: 'type'
        , payload: 'payload'
        , hash: 'hash'
        , priority: null
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

        const result = DAO.getMessage(namespace, messageId)
        const rawMessageResult = getRawMessage(namespace, messageId)
        const rawStatsResult = getRawStats(namespace)

        expect(result).toEqual({
          type: 'type'
        , payload: 'payload'
        , priority: null
        })
        expect(rawMessageResult).toMatchObject({
          state: 'active'
        , state_updated_at: getTimestamp()
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
        const namespace = 'namespace'
        const messageId = 'message-id'
        setRawMessage({
          namespace
        , id: messageId
        , type: null
        , payload: null
        , hash: null
        , priority: null
        , state: 'drafting'
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

        const err = getError(() => DAO.getMessage(namespace, messageId))

        expect(err).toBeInstanceOf(BadMessageState)
      })
    })

    describe('other states', () => {
      it('return IMessage', () => {
        const namespace = 'namespace'
        const messageId = 'message-id'
        setRawMessage({
          namespace
        , id: messageId
        , type: 'type'
        , payload: 'payload'
        , hash: 'hash'
        , priority: null
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

        const result = DAO.getMessage(namespace, messageId)
        const rawMessageResult = getRawMessage(namespace, messageId)
        const rawStatsResult = getRawStats(namespace)

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
