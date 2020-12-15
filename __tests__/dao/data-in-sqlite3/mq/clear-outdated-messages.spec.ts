import * as DAO from '@dao/data-in-sqlite3/mq/clear-outdated-messages'
import { getDatabase } from '@dao/data-in-sqlite3/database'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { setRawMessage, setRawStats, getRawStats, hasRawMessage } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('clearOutdatedDraftingMessages(queueId: string, timestamp: number): void', () => {
  it('return undefined', async () => {
    const db = await getDatabase()
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

    const result = DAO.clearOutdatedDraftingMessages(queueId, 1)
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

describe('clearOutdatedOrderedMessages(queueId: string, timestamp: number): void', () => {
  it('return undefined', async () => {
    const db = await getDatabase()
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

    const result = DAO.clearOutdatedOrderedMessages(queueId, 1)
    const message1Exists = hasRawMessage(db, queueId, '1')
    const message2Exists = hasRawMessage(db, queueId, '2')
    const stats = getRawStats(db, queueId)

    expect(result).toBeUndefined()
    expect(message1Exists).toBeFalse()
    expect(message2Exists).toBeTrue()
    expect(stats).toMatchObject({
      drafting: 0
    , waiting: 0
    , ordered: 1
    , active: 0
    , completed: 0
    })
  })
})

describe('clearOutdatedActiveMessages(queueId: string, timestamp: number): void', () => {
  it('return undefined', async () => {
    const db = await getDatabase()
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

    const result = DAO.clearOutdatedActiveMessages(queueId, 1)
    const message1Exists = hasRawMessage(db, queueId, '1')
    const message2Exists = hasRawMessage(db, queueId, '2')
    const stats = getRawStats(db, queueId)

    expect(result).toBeUndefined()
    expect(message1Exists).toBeFalse()
    expect(message2Exists).toBeTrue()
    expect(stats).toMatchObject({
      drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 1
    , completed: 0
    })
  })
})
