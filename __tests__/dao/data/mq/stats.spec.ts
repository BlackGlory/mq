import * as DAO from '@dao/data/mq/stats.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawStats } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('stats(namespace: string): IStats', () => {
  describe('exist', () => {
    it('return IStats', () => {
      const namespace = 'namespace'
      setRawStats({
        namespace
      , drafting: 1
      , waiting: 2
      , ordered: 3
      , active: 4
      , completed: 5
      , failed: 6
      })

      const result = DAO.stats(namespace)

      expect(result).toEqual({
        namespace
      , drafting: 1
      , waiting: 2
      , ordered: 3
      , active: 4
      , completed: 5
      , failed: 6
      })
    })
  })

  describe('not exist', () => {
    it('return IStats', () => {
      const namespace = 'namespace'

      const result = DAO.stats(namespace)

      expect(result).toEqual({
        namespace
      , drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 0
      , failed: 0
      })
    })
  })
})
