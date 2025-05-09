import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import * as DAO from '@dao/mq/get-all-namespaces.js'
import { initializeDatabases, clearDatabase } from '@test/utils.js'
import { setRawStats } from './utils.js'
import { toArray } from 'iterable-operator'

beforeEach(initializeDatabases)
afterEach(clearDatabase)

describe('getAllNamespaces(): Iterable<string>', () => {
  describe('exist', () => {
    it('return Iterable<string>', () => {
      const namespace = 'namespace'
      setRawStats({
        namespace
      , drafting: 0
      , waiting: 0
      , ordered: 0
      , active: 0
      , completed: 1
      , failed: 0
      })

      const result = DAO.getAllNamespaces()

      expect(toArray(result)).toEqual([namespace])
    })
  })

  describe('not exist', () => {
    it('return empty iterable', () => {
      const result = DAO.getAllNamespaces()

      expect(toArray(result)).toEqual([])
    })
  })
})
