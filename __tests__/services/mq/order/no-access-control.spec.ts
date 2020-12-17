import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { prepareWaitingMessage } from './utils'

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
    const messageId = 'message-id'
    const server = await buildServer()
    await prepareWaitingMessage(mqId, messageId, 'text/plain', 'payload')

    const res = await server.inject({
      method: 'GET'
    , url: `/mq/${mqId}/messages`
    })

    expect(res.statusCode).toBe(200)
  })
})