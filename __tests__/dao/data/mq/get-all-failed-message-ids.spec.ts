import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import * as DAO from '@dao/mq/get-all-failed-message-ids.js'
import { initializeDatabases, clearDatabase } from '@test/utils.js'
import { setMinimalRawMessage, setRawStats } from './utils.js'
import { toArray } from 'iterable-operator'
import { _setMockedTimestamp, _clearMockedTimestamp } from '@dao/mq/utils/get-timestamp.js'

beforeEach(initializeDatabases)
afterEach(clearDatabase)

beforeEach(() => _setMockedTimestamp(Date.now()))
afterEach(_clearMockedTimestamp)

describe('getAllFailedMessageIds(namespace: string): Iterable<string>', () => {
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

      const result = DAO.getAllFailedMessageIds(namespace)

      expect(toArray(result)).toEqual([messageId])
    })
  })

  describe('not exist', () => {
    it('return empty iterable', () => {
      const namespace = 'namespace'

      const result = DAO.getAllFailedMessageIds(namespace)

      expect(toArray(result)).toEqual([])
    })
  })
})
