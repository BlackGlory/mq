import * as DAO from '@dao/data-in-sqlite3/mq/get-all-failed-message-ids'
import { reset } from '@test/utils'
import { setMinimalRawMessage, setRawStats } from './utils'
import { toArray } from 'iterable-operator'
import 'jest-extended'
import '@blackglory/jest-matchers'

const timestamp = Date.now()

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/mq/utils/get-timestamp', () => ({
  getTimestamp() {
    return timestamp
  }
}))

beforeEach(reset)

describe('getAllFailedMessageIds(queueId: string): Iterable<string>', () => {
  describe('exist', () => {
    it('return Iterable<string>', () => {
      const queueId = 'queue-id'
      const messageId = 'message-id'
      setMinimalRawMessage({
        mq_id: queueId
      , message_id: messageId
      , state: 'failed'
      , state_updated_at: 0
      })
      setRawStats({
        mq_id: queueId
      , active: 0
      , completed: 0
      , drafting: 0
      , failed: 1
      , ordered: 0
      , waiting: 0
      })

      const result = DAO.getAllFailedMessageIds(queueId)

      expect(result).toBeIterable()
      expect(toArray(result)).toEqual([messageId])
    })
  })

  describe('not exist', () => {
    it('return empty iterable', () => {
      const queueId = 'queue-id'

      const result = DAO.getAllFailedMessageIds(queueId)

      expect(result).toBeIterable()
      expect(toArray(result)).toEqual([])
    })
  })
})
