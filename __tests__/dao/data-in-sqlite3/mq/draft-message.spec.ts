import * as DAO from '@dao/data-in-sqlite3/mq/draft-message.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { getRawMessage, getRawStats } from './utils.js'
import { _setMockedTimestamp, _clearMockedTimestamp, getTimestamp } from '@dao/data-in-sqlite3/mq/utils/get-timestamp.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

beforeEach(() => _setMockedTimestamp(Date.now()))
afterEach(_clearMockedTimestamp)

describe('draftMessage(namespace: string, messageId: string, priority?: number): void', () => {
  it('insert a drafting message', () => {
    const namespace = 'namespace'
    const messageId = 'message-id'

    const result = DAO.draftMessage(namespace, messageId)
    const rawMessageResult = getRawMessage(namespace, messageId)
    const rawStatsResult = getRawStats(namespace)

    expect(result).toBeUndefined()
    expect(rawMessageResult).toMatchObject({
      priority: null
    , type: null
    , payload: null
    , hash: null
    , state: 'drafting'
    , state_updated_at: getTimestamp()
    })
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
