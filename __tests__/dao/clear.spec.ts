import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { initializeDatabases, clearDatabase } from '@test/utils.js'
import { setMinimalRawMessage, setRawStats, hasRawStats, hasRawMessage } from './utils.js'
import { clear } from '@dao/clear.js'

beforeEach(initializeDatabases)
afterEach(clearDatabase)

describe('clear', () => {
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

    const result = clear(namespace)
    const messageExists = hasRawMessage(namespace, messageId)
    const statsExists = hasRawStats(namespace)

    expect(result).toBeUndefined()
    expect(messageExists).toBe(false)
    expect(statsExists).toBe(false)
  })
})
