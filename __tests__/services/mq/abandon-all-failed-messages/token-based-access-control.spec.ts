import { startService, stopService, getAddress } from '@test/utils'
import { AccessControlDAO } from '@dao'
import { prepareFailedMessage } from './utils'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname, searchParam } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need delete tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          const token = 'token'
          await prepareFailedMessage(namespace, id, 'text/plain', 'payload')
          await AccessControlDAO.setConsumeTokenRequired(namespace, true)
          await AccessControlDAO.setConsumeToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}/failed-messages`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          const token = 'token'
          await prepareFailedMessage(namespace, id, 'text/plain', 'payload')
          await AccessControlDAO.setConsumeTokenRequired(namespace, true)
          await AccessControlDAO.setConsumeToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}/failed-messages`)
          , searchParam('token', 'bad')
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          const token = 'token'
          await prepareFailedMessage(namespace, id, 'text/plain', 'payload')
          await AccessControlDAO.setConsumeTokenRequired(namespace, true)
          await AccessControlDAO.setConsumeToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}/failed-messages`)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need consume tokens', () => {
      describe('CONSUME_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.MQ_CONSUME_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          await prepareFailedMessage(namespace, id, 'text/plain', 'payload')

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}/failed-messages`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('CONSUME_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          await prepareFailedMessage(namespace, id, 'text/plain', 'payload')

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}/failed-messages`)
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
          const id = 'message-id'
          const token = 'token'
          await prepareFailedMessage(namespace, id, 'text/plain', 'payload')
          await AccessControlDAO.setConsumeTokenRequired(namespace, true)
          await AccessControlDAO.setConsumeToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}/failed-messages`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('namespace does not need consume tokens', () => {
      describe('CONSUME_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.MQ_CONSUME_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          const token = 'token'
          await prepareFailedMessage(namespace, id, 'text/plain', 'payload')
          await AccessControlDAO.setConsumeTokenRequired(namespace, true)
          await AccessControlDAO.setConsumeToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/mq/${namespace}/failed-messages`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})
