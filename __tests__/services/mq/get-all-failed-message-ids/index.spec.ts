import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { prepareFailedMessages } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('no access control', () => {
  it('200', async () => {
    const queueId = 'queue-id'
    const messageIds = ['message-id']
    const server = await buildServer()
    prepareFailedMessages(queueId, messageIds)

    const res = await server.inject({
      method: 'GET'
    , url: `/mq/${queueId}/failed-messages`
    })

    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual(messageIds)
  })
})
