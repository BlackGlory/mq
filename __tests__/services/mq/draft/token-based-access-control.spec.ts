import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { createJsonHeaders } from './utils'

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
          const token = 'token'
          const payload = { priority: null }
          const server = await buildServer()
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

          const res = await server.inject({
            method: 'POST'
          , url: `/mq/${mqId}/messages`
          , query: { token }
          , headers: createJsonHeaders()
          , payload: JSON.stringify(payload)
          })

          expect(res.statusCode).toBe(200)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const token = 'token'
          const payload = { priority: null }
          const server = await buildServer()
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

          const res = await server.inject({
            method: 'POST'
          , url: `/mq/${mqId}/messages`
          , query: { token: 'bad' }
          , headers: createJsonHeaders()
          , payload: JSON.stringify(payload)
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const token = 'token'
          const payload = { priority: null }
          const server = await buildServer()
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

          const res = await server.inject({
            method: 'POST'
          , url: `/mq/${mqId}/messages`
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
          const payload = { priority: null }
          const server = await buildServer()

          const res = await server.inject({
            method: 'POST'
          , url: `/mq/${mqId}/messages`
          , headers: createJsonHeaders()
          , payload: JSON.stringify(payload)
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('PRODUCE_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const payload = { priority: null }
          const server = await buildServer()

          const res = await server.inject({
            method: 'POST'
          , url: `/mq/${mqId}/messages`
          , headers: createJsonHeaders()
          , payload: JSON.stringify(payload)
          })

          expect(res.statusCode).toBe(200)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('id need produce tokens', () => {
      describe('no token', () => {
        it('200', async () => {
          const mqId = 'mq-id'
          const token = 'token'
          const payload = { priority: null }
          const server = await buildServer()
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

          const res = await server.inject({
            method: 'POST'
          , url: `/mq/${mqId}/messages`
          , headers: createJsonHeaders()
          , payload: JSON.stringify(payload)
          })

          expect(res.statusCode).toBe(200)
        })
      })
    })

    describe('id does not need produce tokens', () => {
      describe('PRODUCE_TOKEN_REQUIRED=true', () => {
        it('200', async () => {
          process.env.MQ_PRODUCE_TOKEN_REQUIRED = 'true'
          const mqId = 'mq-id'
          const token = 'token'
          const payload = { priority: null }
          const server = await buildServer()
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

          const res = await server.inject({
            method: 'POST'
          , url: `/mq/${mqId}/messages`
          , headers: createJsonHeaders()
          , payload: JSON.stringify(payload)
          })

          expect(res.statusCode).toBe(200)
        })
      })
    })
  })
})
