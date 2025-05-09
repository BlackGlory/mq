import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { initializeDatabases, clearDatabase } from '@test/utils.js'
import { setRawStats } from './utils.js'
import { toArray } from 'iterable-operator'
import { getAllNamespaces } from '@dao/get-all-namespaces.js'

beforeEach(initializeDatabases)
afterEach(clearDatabase)

describe('getAllNamespaces', () => {
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

      const result = getAllNamespaces()

      expect(toArray(result)).toEqual([namespace])
    })
  })

  describe('not exist', () => {
    it('return empty iterable', () => {
      const result = getAllNamespaces()

      expect(toArray(result)).toEqual([])
    })
  })
})
