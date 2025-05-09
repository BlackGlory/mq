import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { initializeDatabases, clearDatabase } from '@test/utils.js'
import { setRawStats } from './utils.js'
import { stats } from '@dao/stats.js'

beforeEach(initializeDatabases)
afterEach(clearDatabase)

describe('stats', () => {
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

      const result = stats(namespace)

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

      const result = stats(namespace)

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
