import * as DAO from '@dao/data-in-sqlite3/mq/abandon-all-failed-messages'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setMinimalRawMessage, setRawStats, getRawStats, hasRawMessage } from './utils'

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

describe('abandonAllFailedMessages(namespace: string): void', () => {
  it('delete messages', () => {
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

    const result = DAO.abandonAllFailedMessages(namespace)

    expect(result).toBeUndefined()
    expect(hasRawMessage(namespace, messageId)).toBe(false)
    expect(getRawStats(namespace)).toMatchObject({
      drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 0
    , failed: 0
    })
  })
})
