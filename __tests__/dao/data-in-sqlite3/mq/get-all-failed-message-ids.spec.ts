import * as DAO from '@dao/data-in-sqlite3/mq/get-all-failed-message-ids.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setMinimalRawMessage, setRawStats } from './utils.js'
import { toArray } from 'iterable-operator'
import { setMockTimestamp, clearMock } from '@dao/data-in-sqlite3/mq/utils/get-timestamp.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

beforeEach(() => setMockTimestamp(Date.now()))
afterEach(clearMock)

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
