import * as DAO from '@dao/data-in-sqlite3/mq/list-all-queue-ids'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { setRawStats } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('listAllQueueIds(): string[]', () => {
  describe('exist', () => {
    it('return IStats', () => {
      const queueId = 'queue-id'
      setRawStats({
        mq_id: queueId
      , drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 1
      })

      const result = DAO.listAllQueueIds()

      expect(result).toEqual([queueId])
    })
  })

  describe('not exist', () => {
    it('return []', () => {
      const result = DAO.listAllQueueIds()

      expect(result).toEqual([])
    })
  })
})
