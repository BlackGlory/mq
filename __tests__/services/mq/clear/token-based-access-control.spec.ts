import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'

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
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setClearTokenRequired(mqId, true)
          await AccessControlDAO.setClearToken({ id: mqId, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}`
          , query: { token }
          })

          expect(res.statusCode).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setClearTokenRequired(mqId, true)
          await AccessControlDAO.setClearToken({ id: mqId, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}`
          , query: { token: 'bad' }
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setClearTokenRequired(mqId, true)
          await AccessControlDAO.setClearToken({ id: mqId, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}`
          })

          expect(res.statusCode).toBe(401)
        })
      })
    })

    describe('id does not need consume tokens', () => {
      describe('CLEAR_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.MQ_CLEAR_TOKEN_REQUIRED = 'true'
          const mqId = 'mq-id'
          const server = getServer()

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}`
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('CLEAR_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const server = getServer()

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}`
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
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setConsumeTokenRequired(mqId, true)
          await AccessControlDAO.setConsumeToken({ id: mqId, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}`
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })

    describe('id does not need consume tokens', () => {
      describe('CLEAR_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.MQ_CLEAR_TOKEN_REQUIRED = 'true'
          const mqId = 'mq-id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setConsumeTokenRequired(mqId, true)
          await AccessControlDAO.setConsumeToken({ id: mqId, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/mq/${mqId}`
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })
  })
})
