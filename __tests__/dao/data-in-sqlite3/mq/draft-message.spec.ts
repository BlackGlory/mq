import * as DAO from '@dao/data-in-sqlite3/mq/draft-message'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getRawMessage, getRawStats } from './utils'
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

describe('draftMessage(queueId: string, messageId: string, priority?: number): void', () => {
  it('insert a drafting message', () => {
    const queueId = 'queue-id'
    const messageId = 'message-id'

    const result = DAO.draftMessage(queueId, messageId)
    const rawMessageResult = getRawMessage(queueId, messageId)
    const rawStatsResult = getRawStats(queueId)

    expect(result).toBeUndefined()
    expect(rawMessageResult).toMatchObject({
      priority: null
    , type: null
    , payload: null
    , hash: null
    , state: 'drafting'
    , state_updated_at: timestamp
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
