import * as DAO from '@dao/data-in-sqlite3/mq/fallback-outdated-messages'
import { getDatabase } from '@dao/data-in-sqlite3/database'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { setRawMessage, setRawStats, getRawStats, hasRawMessage, getRawMessage } from './utils'
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

describe('fallbackOutdatedDraftingMessages(queueId: string, timestamp: number): void', () => {
  it('return undefined', () => {
    const db = getDatabase()
    const queueId = 'queue-id'
    setRawMessage(db, {
      mq_id: queueId
    , message_id: '1'
    , hash: null
    , payload: null
    , priority: null
    , state: 'drafting'
    , state_updated_at: 0
    , type: null
    })
    setRawMessage(db, {
      mq_id: queueId
    , message_id: '2'
    , hash: null
    , payload: null
    , priority: null
    , state: 'drafting'
    , state_updated_at: 1
    , type: null
    })
    setRawStats(db, {
      mq_id: queueId
    , drafting: 2
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 0
    })

    const result = DAO.fallbackOutdatedDraftingMessages(queueId, 1)
    const message1Exists = hasRawMessage(db, queueId, '1')
    const message2Exists = hasRawMessage(db, queueId, '2')
    const stats = getRawStats(db, queueId)

    expect(result).toBeUndefined()
    expect(message1Exists).toBeFalse()
    expect(message2Exists).toBeTrue()
    expect(stats).toMatchObject({
      drafting: 1
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 0
    })
  })
})

describe('fallbackOutdatedOrderedMessages(queueId: string, timestamp: number): void', () => {
  it('return undefined', () => {
    const db = getDatabase()
    const queueId = 'queue-id'
    setRawMessage(db, {
      mq_id: queueId
    , message_id: '1'
    , hash: null
    , payload: null
    , priority: null
    , state: 'ordered'
    , state_updated_at: 0
    , type: null
    })
    setRawMessage(db, {
      mq_id: queueId
    , message_id: '2'
    , hash: null
    , payload: null
    , priority: null
    , state: 'ordered'
    , state_updated_at: 1
    , type: null
    })
    setRawStats(db, {
      mq_id: queueId
    , drafting: 0
    , waiting: 0
    , ordered: 2
    , active: 0
    , completed: 0
    })

    const result = DAO.fallbackOutdatedOrderedMessages(queueId, 1)
    const message1 = getRawMessage(db, queueId, '1')
    const message2 = getRawMessage(db, queueId, '2')
    const stats = getRawStats(db, queueId)

    expect(result).toBeUndefined()
    expect(message1).toMatchObject({
      state: 'waiting'
    , state_updated_at: timestamp
    })
    expect(message2).toMatchObject({
      state: 'ordered'
    , state_updated_at: 1
    , type: null
    })
    expect(stats).toMatchObject({
      drafting: 0
    , waiting: 1
    , ordered: 1
    , active: 0
    , completed: 0
    })
  })
})

describe('fallbackOutdatedActiveMessages(queueId: string, timestamp: number): void', () => {
  it('return undefined', () => {
    const db = getDatabase()
    const queueId = 'queue-id'
    setRawMessage(db, {
      mq_id: queueId
    , message_id: '1'
    , hash: null
    , payload: null
    , priority: null
    , state: 'active'
    , state_updated_at: 0
    , type: null
    })
    setRawMessage(db, {
      mq_id: queueId
    , message_id: '2'
    , hash: null
    , payload: null
    , priority: null
    , state: 'active'
    , state_updated_at: 1
    , type: null
    })
    setRawStats(db, {
      mq_id: queueId
    , drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 2
    , completed: 0
    })

    const result = DAO.fallbackOutdatedActiveMessages(queueId, 1)
    const message1 = getRawMessage(db, queueId, '1')
    const message2 = getRawMessage(db, queueId, '2')
    const stats = getRawStats(db, queueId)

    expect(result).toBeUndefined()
    expect(message1).toMatchObject({
      state: 'waiting'
    , state_updated_at: timestamp
    })
    expect(message2).toMatchObject({
      state: 'active'
    , state_updated_at: 1
    })
    expect(stats).toMatchObject({
      drafting: 0
    , waiting: 1
    , ordered: 0
    , active: 1
    , completed: 0
    })
  })
})
