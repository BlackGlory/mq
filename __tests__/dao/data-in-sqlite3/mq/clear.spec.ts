import * as DAO from '@dao/data-in-sqlite3/mq/clear'
import { initializeDatabases, clearDatabases } from '@test/utils'
import {
  setRawThrottle, setMinimalRawMessage, setRawStats
, hasRawThrottle, hasRawStats, hasRawMessage
} from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('clear(namespace: string): void', () => {
  it('return undefined', () => {
    const namespace = 'namespace'
    const messageId = 'message-id'
    setMinimalRawMessage({
      namespace
    , id: messageId
    , state: 'waiting'
    , state_updated_at: 0
    })
    setRawStats({
      namespace
    , drafting: 0
    , waiting: 1
    , ordered: 0
    , active: 0
    , completed: 0
    , failed: 0
    })
    setRawThrottle({
      namespace
    , cycle_start_time: 0
    , count: 1
    })

    const result = DAO.clear(namespace)
    const messageExists = hasRawMessage(namespace, messageId)
    const statsExists = hasRawStats(namespace)
    const throttleExists = hasRawThrottle(namespace)

    expect(result).toBeUndefined()
    expect(messageExists).toBeFalse()
    expect(statsExists).toBeFalse()
    expect(throttleExists).toBeFalse()
  })
})
