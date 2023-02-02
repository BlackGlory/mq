import * as DAO from '@dao/data/mq/clear.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setMinimalRawMessage, setRawStats, hasRawStats, hasRawMessage } from './utils.js'

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

    const result = DAO.clear(namespace)
    const messageExists = hasRawMessage(namespace, messageId)
    const statsExists = hasRawStats(namespace)

    expect(result).toBeUndefined()
    expect(messageExists).toBe(false)
    expect(statsExists).toBe(false)
  })
})
