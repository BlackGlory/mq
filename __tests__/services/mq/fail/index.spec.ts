import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { prepareActiveMessage } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const mqId = 'mq-id'
    const messageId = 'message-id'
    const server = getServer()
    await prepareActiveMessage(mqId, messageId, 'text/plain', 'payload')

    const res = await server.inject({
      method: 'PATCH'
    , url: `/mq/${mqId}/messages/${messageId}/fail`
    })

    expect(res.statusCode).toBe(204)
  })
})
