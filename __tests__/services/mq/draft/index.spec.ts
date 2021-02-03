import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { createJsonHeaders } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('no access control', () => {
  it('200', async () => {
    const mqId = 'mq-id'
    const payload = { priority: null }
    const server = await buildServer()

    const res = await server.inject({
      method: 'POST'
    , url: `/mq/${mqId}/messages`
    , headers: createJsonHeaders()
    , payload: JSON.stringify(payload)
    })

    expect(res.statusCode).toBe(200)
  })
})