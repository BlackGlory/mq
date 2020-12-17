import * as DAO from '@dao/data-in-sqlite3/mq/get-all-working-queue-ids'
import { getDatabase } from '@dao/data-in-sqlite3/database'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { setRawStats, setRawMessage } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('getAllWorkingQueueIds(): string[]', () => {
  it('return string[]', () => {
    const db = getDatabase()
    setRawStats(db, {
      mq_id: 'id-1'
    , drafting: 1
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 0
    })
    setRawStats(db, {
      mq_id: 'id-2'
    , drafting: 0
    , waiting: 1
    , ordered: 0
    , active: 0
    , completed: 0
    })
    setRawStats(db, {
      mq_id: 'id-3'
    , drafting: 0
    , waiting: 0
    , ordered: 1
    , active: 0
    , completed: 0
    })
    setRawStats(db, {
      mq_id: 'id-4'
    , drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 1
    , completed: 0
    })
    setRawStats(db, {
      mq_id: 'id-5'
    , drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 1
    })

    const result = DAO.getAllWorkingQueueIds()

    expect(result).toEqual(['id-3', 'id-4'])
  })
})
