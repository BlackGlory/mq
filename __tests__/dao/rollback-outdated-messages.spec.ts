import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { initializeDatabases, clearDatabase } from '@test/utils.js'
import { setRawMessage, setRawStats, getRawStats, hasRawMessage, getRawMessage } from './utils.js'
import { _setMockedTimestamp, _clearMockedTimestamp, getTimestamp } from '@dao/utils/get-timestamp.js'
import { rollbackOutdatedActiveMessages, rollbackOutdatedDraftingMessages, rollbackOutdatedOrderedMessages } from '@dao/rollback-outdated-messages.js'

beforeEach(initializeDatabases)
afterEach(clearDatabase)

beforeEach(() => _setMockedTimestamp(Date.now()))
afterEach(_clearMockedTimestamp)

describe('rollbackOutdatedDraftingMessages', () => {
  describe('no changes', () => {
    it('return false', () => {
      const namespace = 'namespace'
      setRawMessage({
        namespace
      , id: '1'
      , hash: null
      , payload: null
      , priority: null
      , state: 'drafting'
      , state_updated_at: 1
      , type: null
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

      const result = rollbackOutdatedDraftingMessages(namespace, 1)
      const messageExists = hasRawMessage(namespace, '1')
      const rawStatsResult = getRawStats(namespace)

      expect(result).toBe(false)
      expect(messageExists).toBe(true)
      expect(rawStatsResult).toMatchObject({
        drafting: 1
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      , failed: 0
      })
    })
  })

  describe('changes', () => {
    it('return true', () => {
      const namespace = 'namespace'
      setRawMessage({
        namespace
      , id: '1'
      , hash: null
      , payload: null
      , priority: null
      , state: 'drafting'
      , state_updated_at: 0
      , type: null
      })
      setRawMessage({
        namespace
      , id: '2'
      , hash: null
      , payload: null
      , priority: null
      , state: 'drafting'
      , state_updated_at: 1
      , type: null
      })
      setRawStats({
        namespace
      , drafting: 2
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      , failed: 0
      })

      const result = rollbackOutdatedDraftingMessages(namespace, 1)
      const message1Exists = hasRawMessage(namespace, '1')
      const message2Exists = hasRawMessage(namespace, '2')
      const rawStatsResult = getRawStats(namespace)

      expect(result).toBe(true)
      expect(message1Exists).toBe(false)
      expect(message2Exists).toBe(true)
      expect(rawStatsResult).toMatchObject({
        drafting: 1
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      , failed: 0
      })
    })
  })
})

describe('rollbackOutdatedOrderedMessages', () => {
  describe('no changes', () => {
    it('return false', () => {
      const namespace = 'namespace'
      setRawMessage({
        namespace
      , id: '1'
      , hash: null
      , payload: null
      , priority: null
      , state: 'ordered'
      , state_updated_at: 1
      , type: null
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

      const result = rollbackOutdatedOrderedMessages(namespace, 1)
      const rawMessageResult = getRawMessage(namespace, '1')
      const rawStatsResult = getRawStats(namespace)

      expect(result).toBe(false)
      expect(rawMessageResult).toMatchObject({
        state: 'ordered'
      , state_updated_at: 1
      , type: null
      })
      expect(rawStatsResult).toMatchObject({
        drafting: 0
      , waiting: 0
      , ordered: 1
      , active: 0
      , completed: 0
      , failed: 0
      })
    })
  })

  describe('changes', () => {
    it('return true', () => {
      const namespace = 'namespace'
      setRawMessage({
        namespace
      , id: '1'
      , hash: null
      , payload: null
      , priority: null
      , state: 'ordered'
      , state_updated_at: 0
      , type: null
      })
      setRawMessage({
        namespace
      , id: '2'
      , hash: null
      , payload: null
      , priority: null
      , state: 'ordered'
      , state_updated_at: 1
      , type: null
      })
      setRawStats({
        namespace
      , drafting: 0
      , waiting: 0
      , ordered: 2
      , active: 0
      , completed: 0
      , failed: 0
      })

      const result = rollbackOutdatedOrderedMessages(namespace, 1)
      const rawMessage1Result = getRawMessage(namespace, '1')
      const rawMessage2Result = getRawMessage(namespace, '2')
      const rawStatsResult = getRawStats(namespace)

      expect(result).toBe(true)
      expect(rawMessage1Result).toMatchObject({
        state: 'waiting'
      , state_updated_at: getTimestamp()
      })
      expect(rawMessage2Result).toMatchObject({
        state: 'ordered'
      , state_updated_at: 1
      , type: null
      })
      expect(rawStatsResult).toMatchObject({
        drafting: 0
      , waiting: 1
      , ordered: 1
      , active: 0
      , completed: 0
      , failed: 0
      })
    })
  })
})

describe('rollbackOutdatedActiveMessages', () => {
  describe('no changes', () => {
    it('return false', () => {
      const namespace = 'namespace'
      setRawMessage({
        namespace
      , id: '1'
      , hash: null
      , payload: null
      , priority: null
      , state: 'active'
      , state_updated_at: 1
      , type: null
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

      const result = rollbackOutdatedActiveMessages(namespace, 1)
      const rawMessageResult = getRawMessage(namespace, '1')
      const rawStatsResult = getRawStats(namespace)

      expect(result).toBe(false)
      expect(rawMessageResult).toMatchObject({
        state: 'active'
      , state_updated_at: 1
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

  describe('changes', () => {
    it('return true', () => {
      const namespace = 'namespace'
      setRawMessage({
        namespace
      , id: '1'
      , hash: null
      , payload: null
      , priority: null
      , state: 'active'
      , state_updated_at: 0
      , type: null
      })
      setRawMessage({
        namespace
      , id: '2'
      , hash: null
      , payload: null
      , priority: null
      , state: 'active'
      , state_updated_at: 1
      , type: null
      })
      setRawStats({
        namespace
      , drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 2
      , completed: 0
      , failed: 0
      })

      const result = rollbackOutdatedActiveMessages(namespace, 1)
      const rawMessage1Result = getRawMessage(namespace, '1')
      const rawMessage2Result = getRawMessage(namespace, '2')
      const rawStatsResult = getRawStats(namespace)

      expect(result).toBe(true)
      expect(rawMessage1Result).toMatchObject({
        state: 'waiting'
      , state_updated_at: getTimestamp()
      })
      expect(rawMessage2Result).toMatchObject({
        state: 'active'
      , state_updated_at: 1
      })
      expect(rawStatsResult).toMatchObject({
        drafting: 0
      , waiting: 1
      , ordered: 0
      , active: 1
      , completed: 0
      , failed: 0
      })
    })
  })
})
