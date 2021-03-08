import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { prepareDraftingMessage, createJsonHeaders } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('204', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const mqId = 'mq-id'
        const messageId = 'message-id'
        const payload = 'payload'
        const server = getServer()
        await prepareDraftingMessage(mqId, messageId)
        await AccessControlDAO.addWhitelistItem(mqId)

        const res = await server.inject({
          method: 'PUT'
        , url: `/mq/${mqId}/messages/${messageId}`
        , headers: createJsonHeaders()
        , payload: JSON.stringify(payload)
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('id not in whitelist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const mqId = 'mq-id'
        const messageId = 'message-id'
        const payload = 'payload'
        const server = getServer()
        await prepareDraftingMessage(mqId, messageId)

        const res = await server.inject({
          method: 'PUT'
        , url: `/mq/${mqId}/messages/${messageId}`
        , headers: createJsonHeaders()
        , payload: JSON.stringify(payload)
        })

        expect(res.statusCode).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('id not in whitelist', () => {
      it('204', async () => {
        const mqId = 'mq-id'
        const messageId = 'message-id'
        const payload = 'payload'
        const server = getServer()
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
  })
})
