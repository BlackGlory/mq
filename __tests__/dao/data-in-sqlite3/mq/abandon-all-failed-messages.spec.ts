import * as DAO from '@dao/data-in-sqlite3/mq/abandon-all-failed-messages.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setMinimalRawMessage, setRawStats, getRawStats, hasRawMessage } from './utils.js'
import { setMockTimestamp, clearMock } from '@dao/data-in-sqlite3/mq/utils/get-timestamp.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

beforeEach(() => setMockTimestamp(Date.now()))
afterEach(clearMock)

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
