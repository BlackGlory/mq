import * as DAO from '@dao/data-in-sqlite3/mq/renew-all-failed-messages'
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

describe('renewAllFailedMessages(namespace: string): void', () => {
  it('convert state to waiting', () => {
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

    const result = DAO.renewAllFailedMessages(namespace)

    expect(result).toBeUndefined()
    expect(hasRawMessage(namespace, messageId)).toBeTrue()
    expect(getRawStats(namespace)).toMatchObject({
      drafting: 0
    , waiting: 1
    , ordered: 0
    , active: 0
    , completed: 0
    , failed: 0
    })
  })
})
