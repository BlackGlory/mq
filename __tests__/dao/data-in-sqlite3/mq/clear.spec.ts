import * as DAO from '@dao/data-in-sqlite3/mq/clear'
import { resetDatabases, resetEnvironment } from '@test/utils'
import {
  setRawThrottle, setMinimalRawMessage, setRawStats
, hasRawThrottle, hasRawStats, hasRawMessage
} from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('clear(queueId: string): void', () => {
  it('return undefined', () => {
    const queueId = 'queue-id'
    const messageId = 'message-id'
    setMinimalRawMessage({
      mq_id: queueId
    , message_id: messageId
    , state: 'waiting'
    , state_updated_at: 0
    })
    setRawStats({
      mq_id: queueId
    , drafting: 0
    , waiting: 1
    , ordered: 0
    , active: 0
    , completed: 0
    , failed: 0
    })
    setRawThrottle({
      mq_id: queueId
    , cycle_start_time: 0
    , count: 1
    })

    const result = DAO.clear(queueId)
    const messageExists = hasRawMessage(queueId, messageId)
    const statsExists = hasRawStats(queueId)
    const throttleExists = hasRawThrottle(queueId)

    expect(result).toBeUndefined()
    expect(messageExists).toBeFalse()
    expect(statsExists).toBeFalse()
    expect(throttleExists).toBeFalse()
  })
})
