import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { prepareDraftingMessage, createJsonHeaders } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('no access control', () => {
  it('204', async () => {
    const mqId = 'mq-id'
    const messageId = 'message-id'
    const payload = 'payload'
    const server = await buildServer()
    await prepareDraftingMessage(mqId, messageId)

    const res = await server.inject({
      method: 'PUT'
    , url: `/mq/${mqId}/messages/${messageId}`
    , headers: createJsonHeaders()
    , payload: JSON.stringify(payload)
    })

    expect(res.statusCode).toBe(204)
  })
})
