import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const mqId = 'mq-id'
    const server = getServer()

    const res = await server.inject({
      method: 'DELETE'
    , url: `/mq/${mqId}`
    })

    expect(res.statusCode).toBe(204)
  })
})
