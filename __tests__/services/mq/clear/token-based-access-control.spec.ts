import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname, searchParam } from 'extra-request/lib/es2018/transformers'

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
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setClearTokenRequired(namespace, true)
          await AccessControlDAO.setClearToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setClearTokenRequired(namespace, true)
          await AccessControlDAO.setClearToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}`)
          , searchParam('token', 'bad')
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setClearTokenRequired(namespace, true)
          await AccessControlDAO.setClearToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}`)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need consume tokens', () => {
      describe('CLEAR_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.MQ_CLEAR_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('CLEAR_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('id need consume tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setConsumeTokenRequired(namespace, true)
          await AccessControlDAO.setConsumeToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('namespace does not need consume tokens', () => {
      describe('CLEAR_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.MQ_CLEAR_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setConsumeTokenRequired(namespace, true)
          await AccessControlDAO.setConsumeToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})
