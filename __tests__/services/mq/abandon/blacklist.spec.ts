import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO, MQDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('blacklist', () => {
  describe('enabled', () => {
    describe('id in blacklist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const mqId = 'mq-id'
        const messageId = 'message-id'
        const server = await buildServer()
        await MQDAO.draftMessage(mqId, messageId)
        await AccessControlDAO.addBlacklistItem(mqId)

        const res = await server.inject({
          method: 'DELETE'
        , url: `/mq/${mqId}/messages/${messageId}`
        })

        expect(res.statusCode).toBe(403)
      })
    })

    describe('id not in blacklist', () => {
      it('204', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const mqId = 'mq-id'
        const messageId = 'message-id'
        const server = await buildServer()
        await MQDAO.draftMessage(mqId, messageId)

        const res = await server.inject({
          method: 'DELETE'
        , url: `/mq/${mqId}/messages/${messageId}`
        })

        expect(res.statusCode).toBe(204)
      })
    })
  })

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('204', async () => {
        const mqId = 'mq-id'
        const messageId = 'message-id'
        const server = await buildServer()
        await MQDAO.draftMessage(mqId, messageId)
        await AccessControlDAO.addBlacklistItem(mqId)

        const res = await server.inject({
          method: 'DELETE'
        , url: `/mq/${mqId}/messages/${messageId}`
        })

        expect(res.statusCode).toBe(204)
      })
    })
  })
})
