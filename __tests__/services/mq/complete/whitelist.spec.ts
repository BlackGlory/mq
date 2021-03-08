import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { prepareActiveMessage } from './utils'

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
        const server = getServer()
        await prepareActiveMessage(mqId, messageId, 'text/plain', 'payload')
        await AccessControlDAO.addWhitelistItem(mqId)

        const res = await server.inject({
          method: 'PATCH'
        , url: `/mq/${mqId}/messages/${messageId}/complete`
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('id not in whitelist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const mqId = 'mq-id'
        const messageId = 'message-id'
        const server = getServer()
        await prepareActiveMessage(mqId, messageId, 'text/plain', 'payload')

        const res = await server.inject({
          method: 'PATCH'
        , url: `/mq/${mqId}/messages/${messageId}/complete`
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
        const server = getServer()
        await prepareActiveMessage(mqId, messageId, 'text/plain', 'payload')

        const res = await server.inject({
          method: 'PATCH'
        , url: `/mq/${mqId}/messages/${messageId}/complete`
        })

        expect(res.statusCode).toBe(204)
      })
    })
  })
})
