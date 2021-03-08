import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO, MQDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need delete tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const token = 'token'
          const server = getServer()
          await MQDAO.draftMessage(mqId, messageId)
          await AccessControlDAO.setConsumeTokenRequired(mqId, true)
          await AccessControlDAO.setConsumeToken({ id: mqId, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}/messages/${messageId}`
          , query: { token }
          })

          expect(res.statusCode).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const token = 'token'
          const server = getServer()
          await MQDAO.draftMessage(mqId, messageId)
          await AccessControlDAO.setConsumeTokenRequired(mqId, true)
          await AccessControlDAO.setConsumeToken({ id: mqId, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}/messages/${messageId}`
          , query: { token: 'bad' }
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const token = 'token'
          const server = getServer()
          await MQDAO.draftMessage(mqId, messageId)
          await AccessControlDAO.setConsumeTokenRequired(mqId, true)
          await AccessControlDAO.setConsumeToken({ id: mqId, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}/messages/${messageId}`
          })

          expect(res.statusCode).toBe(401)
        })
      })
    })

    describe('id does not need consume tokens', () => {
      describe('CONSUME_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.MQ_CONSUME_TOKEN_REQUIRED = 'true'
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const server = getServer()
          await MQDAO.draftMessage(mqId, messageId)

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}/messages/${messageId}`
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('CONSUME_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const server = getServer()
          await MQDAO.draftMessage(mqId, messageId)

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}/messages/${messageId}`
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('id need consume tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const token = 'token'
          const server = getServer()
          await MQDAO.draftMessage(mqId, messageId)
          await AccessControlDAO.setConsumeTokenRequired(mqId, true)
          await AccessControlDAO.setConsumeToken({ id: mqId, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}/messages/${messageId}`
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })

    describe('id does not need consume tokens', () => {
      describe('CONSUME_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.MQ_CONSUME_TOKEN_REQUIRED = 'true'
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const token = 'token'
          const server = getServer()
          await MQDAO.draftMessage(mqId, messageId)
          await AccessControlDAO.setConsumeTokenRequired(mqId, true)
          await AccessControlDAO.setConsumeToken({ id: mqId, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}/messages/${messageId}`
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })
  })
})
