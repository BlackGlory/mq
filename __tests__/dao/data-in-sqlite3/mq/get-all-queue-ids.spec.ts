import * as DAO from '@dao/data-in-sqlite3/mq/get-all-queue-ids'
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

describe('getAllQueueIds(): Iterable<string>', () => {
  describe('exist', () => {
    it('return Iterable<string>', () => {
      const queueId = 'queue-id'
      setRawStats({
        mq_id: queueId
      , drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 1
      , failed: 0
      })

      const result = DAO.getAllQueueIds()

      expect(result).toBeIterable()
      expect(toArray(result)).toEqual([queueId])
    })
  })

  describe('not exist', () => {
    it('return empty iterable', () => {
      const result = DAO.getAllQueueIds()

      expect(result).toBeIterable()
      expect(toArray(result)).toEqual([])
    })
  })
})
