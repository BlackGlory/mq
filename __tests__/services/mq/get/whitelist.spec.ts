import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { prepareOrderedMessage } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('200', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const mqId = 'mq-id'
        const messageId = 'message-id'
        const server = await buildServer()
        await prepareOrderedMessage(mqId, messageId, 'text/plain', 'payload')
        await AccessControlDAO.addWhitelistItem(mqId)

        const res = await server.inject({
          method: 'GET'
        , url: `/mq/${mqId}/messages/${messageId}`
        })

        expect(res.statusCode).toBe(200)
      })
    })

    describe('id not in whitelist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const mqId = 'mq-id'
        const messageId = 'message-id'
        const server = await buildServer()
        await prepareOrderedMessage(mqId, messageId, 'text/plain', 'payload')

        const res = await server.inject({
          method: 'GET'
        , url: `/mq/${mqId}/messages/${messageId}`
        })

        expect(res.statusCode).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('id not in whitelist', () => {
      it('200', async () => {
        const mqId = 'mq-id'
        const messageId = 'message-id'
        const server = await buildServer()
        await prepareOrderedMessage(mqId, messageId, 'text/plain', 'payload')

        const res = await server.inject({
          method: 'GET'
        , url: `/mq/${mqId}/messages/${messageId}`
        })

        expect(res.statusCode).toBe(200)
      })
    })
  })
})