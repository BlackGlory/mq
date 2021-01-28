import * as DAO from '@dao/data-in-sqlite3/mq/get-all-working-queue-ids'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { setRawStats } from './utils'
import { toArray } from 'iterable-operator'
import '@blackglory/jest-matchers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('getAllWorkingQueueIds(): Iterable<string>', () => {
  it('return Iterable<string>', () => {
    setRawStats({
      mq_id: 'id-1'
    , drafting: 1
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 0
    , failed: 0
    })
    setRawStats({
      mq_id: 'id-2'
    , drafting: 0
    , waiting: 1
    , ordered: 0
    , active: 0
    , completed: 0
    , failed: 0
    })
    setRawStats({
      mq_id: 'id-3'
    , drafting: 0
    , waiting: 0
    , ordered: 1
    , active: 0
    , completed: 0
    , failed: 0
    })
    setRawStats({
      mq_id: 'id-4'
    , drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 1
    , completed: 0
    , failed: 0
    })
    setRawStats({
      mq_id: 'id-5'
    , drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 1
    , failed: 0
    })
    setRawStats({
      mq_id: 'id-6'
    , drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 0
    , failed: 1
    })

    const result = DAO.getAllWorkingQueueIds()

    expect(result).toBeIterable()
    expect(toArray(result)).toEqual(['id-3', 'id-4'])
  })
})
