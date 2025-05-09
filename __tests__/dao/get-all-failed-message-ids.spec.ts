import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { initializeDatabases, clearDatabase } from '@test/utils.js'
import { setMinimalRawMessage, setRawStats } from './utils.js'
import { toArray } from 'iterable-operator'
import { _setMockedTimestamp, _clearMockedTimestamp } from '@dao/utils/get-timestamp.js'
import { getAllFailedMessageIds } from '@dao/get-all-failed-message-ids.js'

beforeEach(initializeDatabases)
afterEach(clearDatabase)

beforeEach(() => _setMockedTimestamp(Date.now()))
afterEach(_clearMockedTimestamp)

describe('getAllFailedMessageIds', () => {
  describe('exist', () => {
    it('return Iterable<string>', () => {
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
      , active: 0
      , completed: 0
      , drafting: 0
      , failed: 1
      , ordered: 0
      , waiting: 0
      })

      const result = getAllFailedMessageIds(namespace)

      expect(toArray(result)).toEqual([messageId])
    })
  })

  describe('not exist', () => {
    it('return empty iterable', () => {
      const namespace = 'namespace'

      const result = getAllFailedMessageIds(namespace)

      expect(toArray(result)).toEqual([])
    })
  })
})
