import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { prepareDraftingMessage, createJsonHeaders } from './utils'

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
          const payload = 'payload'
          const token = 'token'
          const server = getServer()
          await prepareDraftingMessage(mqId, messageId)
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

          const res = await server.inject({
            method: 'PUT'
          , url: `/mq/${mqId}/messages/${messageId}`
          , query: { token }
          , headers: createJsonHeaders()
          , payload: JSON.stringify(payload)
          })

          expect(res.statusCode).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const payload = 'payload'
          const token = 'token'
          const server = getServer()
          await prepareDraftingMessage(mqId, messageId)
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

          const res = await server.inject({
            method: 'PUT'
          , url: `/mq/${mqId}/messages/${messageId}`
          , headers: createJsonHeaders()
          , query: { token: 'bad' }
          , payload: JSON.stringify(payload)
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const payload = 'payload'
          const token = 'token'
          const server = getServer()
          await prepareDraftingMessage(mqId, messageId)
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

          const res = await server.inject({
            method: 'PUT'
          , url: `/mq/${mqId}/messages/${messageId}`
          , headers: createJsonHeaders()
          , payload: JSON.stringify(payload)
          })

          expect(res.statusCode).toBe(401)
        })
      })
    })

    describe('id does not need produce tokens', () => {
      describe('PRODUCE_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.MQ_PRODUCE_TOKEN_REQUIRED = 'true'
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

          expect(res.statusCode).toBe(401)
        })
      })

      describe('PRODUCE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
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

  describe('disabled', () => {
    describe('id need produce tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const payload = 'payload'
          const token = 'token'
          const server = getServer()
          await prepareDraftingMessage(mqId, messageId)
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

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

    describe('id does not need produce tokens', () => {
      describe('PRODUCE_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.MQ_PRODUCE_TOKEN_REQUIRED = 'true'
          const mqId = 'mq-id'
          const messageId = 'message-id'
          const payload = 'payload'
          const token = 'token'
          const server = getServer()
          await prepareDraftingMessage(mqId, messageId)
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

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
})
