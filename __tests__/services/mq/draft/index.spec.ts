import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { createJsonHeaders } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const mqId = 'mq-id'
    const payload = { priority: null }
    const server = getServer()

    const res = await server.inject({
      method: 'POST'
    , url: `/mq/${mqId}/messages`
    , headers: createJsonHeaders()
    , payload: JSON.stringify(payload)
    })

    expect(res.statusCode).toBe(200)
  })
})
