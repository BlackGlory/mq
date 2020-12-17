import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { prepareWaitingMessage } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need delete tokens', () => {
      describe('token matched', () => {
        it('200', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const token = 'token'
          const server = await buildServer()
          await prepareWaitingMessage(mqId, messageId, 'text/plain', 'payload')
          await AccessControlDAO.setConsumeTokenRequired(mqId, true)
          await AccessControlDAO.setConsumeToken({ id: mqId, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/mq/${mqId}/messages`
          , query: { token }
          })

          expect(res.statusCode).toBe(200)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const token = 'token'
          const server = await buildServer()
          await prepareWaitingMessage(mqId, messageId, 'text/plain', 'payload')
          await AccessControlDAO.setConsumeTokenRequired(mqId, true)
          await AccessControlDAO.setConsumeToken({ id: mqId, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/mq/${mqId}/messages`
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
          const server = await buildServer()
          await prepareWaitingMessage(mqId, messageId, 'text/plain', 'payload')
          await AccessControlDAO.setConsumeTokenRequired(mqId, true)
          await AccessControlDAO.setConsumeToken({ id: mqId, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/mq/${mqId}/messages`
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
          const server = await buildServer()
          await prepareWaitingMessage(mqId, messageId, 'text/plain', 'payload')

          const res = await server.inject({
            method: 'GET'
          , url: `/mq/${mqId}/messages`
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('CONSUME_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
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
    })
  })

  describe('disabled', () => {
    describe('id need consume tokens', () => {
      describe('no token', () => {
        it('200', async () => {
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const token = 'token'
          const server = await buildServer()
          await prepareWaitingMessage(mqId, messageId, 'text/plain', 'payload')
          await AccessControlDAO.setConsumeTokenRequired(mqId, true)
          await AccessControlDAO.setConsumeToken({ id: mqId, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/mq/${mqId}/messages`
          })

          expect(res.statusCode).toBe(200)
        })
      })
    })

    describe('id does not need consume tokens', () => {
      describe('CONSUME_TOKEN_REQUIRED=true', () => {
        it('200', async () => {
          process.env.MQ_CONSUME_TOKEN_REQUIRED = 'true'
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const token = 'token'
          const server = await buildServer()
          await prepareWaitingMessage(mqId, messageId, 'text/plain', 'payload')
          await AccessControlDAO.setConsumeTokenRequired(mqId, true)
          await AccessControlDAO.setConsumeToken({ id: mqId, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/mq/${mqId}/messages`
          })

          expect(res.statusCode).toBe(200)
        })
      })
    })
  })
})
