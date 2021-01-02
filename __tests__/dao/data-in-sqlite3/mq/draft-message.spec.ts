import * as DAO from '@dao/data-in-sqlite3/mq/draft-message'
import { getDatabase } from '@dao/data-in-sqlite3/database'
import { resetDatabases, resetEnvironment } from '@test/utils'
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

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('draftMessage(queueId: string, messageId: string, priority?: number): void', () => {
  it('insert a drafting message', () => {
    const db = getDatabase()
    const queueId = 'queue-id'
    const messageId = 'message-id'

    const result = DAO.draftMessage(queueId, messageId)
    const message = getRawMessage(db, queueId, messageId)
    const stats = getRawStats(db, queueId)

    expect(result).toBeUndefined()
    expect(message).toMatchObject({
      priority: null
    , type: null
    , payload: null
    , hash: null
    , state: 'drafting'
    , state_updated_at: timestamp
    })
    expect(stats).toMatchObject({
      drafting: 1
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 0
    })
  })
})
