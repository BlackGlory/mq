import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import * as DAO from '@dao/mq/get-all-working-namespaces.js'
import { initializeDatabases, clearDatabase } from '@test/utils.js'
import { setRawStats } from './utils.js'
import { toArray } from 'iterable-operator'

beforeEach(initializeDatabases)
afterEach(clearDatabase)

describe('getAllWorkingQueueIds(): Iterable<string>', () => {
  it('return Iterable<string>', () => {
    setRawStats({
      namespace: 'namespace-1'
    , drafting: 1
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 0
    , failed: 0
    })
    setRawStats({
      namespace: 'namespace-2'
    , drafting: 0
    , waiting: 1
    , ordered: 0
    , active: 0
    , completed: 0
    , failed: 0
    })
    setRawStats({
      namespace: 'namespace-3'
    , drafting: 0
    , waiting: 0
    , ordered: 1
    , active: 0
    , completed: 0
    , failed: 0
    })
    setRawStats({
      namespace: 'namespace-4'
    , drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 1
    , completed: 0
    , failed: 0
    })
    setRawStats({
      namespace: 'namespace-5'
    , drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 1
    , failed: 0
    })
    setRawStats({
      namespace: 'namespace-6'
    , drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 0
    , completed: 0
    , failed: 1
    })

    const result = DAO.getAllWorkingNamespaces()

    expect(toArray(result)).toEqual(['namespace-3', 'namespace-4'])
  })
})
