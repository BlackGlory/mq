import * as DAO from '@dao/data-in-sqlite3/mq/abandon-all-failed-messages'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setMinimalRawMessage, setRawStats, getRawStats, hasRawMessage } from './utils'
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

describe('abandonAllFailedMessages(queueId: string): void', () => {
  it('delete messages', () => {
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
    , drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 0
    , failed: 1
    })

    const result = DAO.abandonAllFailedMessages(queueId)

    expect(result).toBeUndefined()
    expect(hasRawMessage(queueId, messageId)).toBeFalse()
    expect(getRawStats(queueId)).toMatchObject({
      drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 0
    , failed: 0
    })
  })
})
