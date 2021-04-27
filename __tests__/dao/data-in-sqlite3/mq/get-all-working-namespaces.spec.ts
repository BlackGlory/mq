import * as DAO from '@dao/data-in-sqlite3/mq/get-all-working-namespaces'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setRawStats } from './utils'
import { toArray } from 'iterable-operator'
import '@blackglory/jest-matchers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

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

    expect(result).toBeIterable()
    expect(toArray(result)).toEqual(['namespace-3', 'namespace-4'])
  })
})
