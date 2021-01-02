import * as DAO from '@dao/data-in-sqlite3/mq/stats'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { setRawStats } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('stats(queueId: string): IStats', () => {
  describe('exist', () => {
    it('return IStats', () => {
      const queueId = 'queue-id'
      setRawStats({
        mq_id: queueId
      , drafting: 1
      , waiting: 2
      , ordered: 3
      , active: 4
      , completed: 5
      })

      const result = DAO.stats(queueId)

      expect(result).toEqual({
        id: queueId
      , drafting: 1
      , waiting: 2
      , ordered: 3
      , active: 4
      , completed: 5
      })
    })
  })

  describe('not exist', () => {
    it('return IStats', () => {
      const queueId = 'queue-id'

      const result = DAO.stats(queueId)

      expect(result).toEqual({
        id: queueId
      , drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      })
    })
  })
})
