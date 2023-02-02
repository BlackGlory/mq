import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import { prepareWaitingMessage } from './utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname, searchParam } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need delete tokens', () => {
      describe('token matched', () => {
        it('200', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          const token = 'token'
          await prepareWaitingMessage(namespace, id, 'text/plain', 'payload')
          AccessControlDAO.TokenPolicy.setConsumeTokenRequired(namespace, true)
          AccessControlDAO.Token.setConsumeToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(200)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          const token = 'token'
          await prepareWaitingMessage(namespace, id, 'text/plain', 'payload')
          AccessControlDAO.TokenPolicy.setConsumeTokenRequired(namespace, true)
          AccessControlDAO.Token.setConsumeToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages`)
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
          await prepareWaitingMessage(namespace, id, 'text/plain', 'payload')
          AccessControlDAO.TokenPolicy.setConsumeTokenRequired(namespace, true)
          AccessControlDAO.Token.setConsumeToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages`)
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
          await prepareWaitingMessage(namespace, id, 'text/plain', 'payload')

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('CONSUME_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          await prepareWaitingMessage(namespace, id, 'text/plain', 'payload')

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages`)
          ))

          expect(res.status).toBe(200)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('id need consume tokens', () => {
      describe('no token', () => {
        it('200', async () => {
          const namespace = 'namespace'
          const id = 'message-id'
          const token = 'token'
          await prepareWaitingMessage(namespace, id, 'text/plain', 'payload')
          AccessControlDAO.TokenPolicy.setConsumeTokenRequired(namespace, true)
          AccessControlDAO.Token.setConsumeToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages`)
          ))

          expect(res.status).toBe(200)
        })
      })
    })

    describe('namespace does not need consume tokens', () => {
      describe('CONSUME_TOKEN_REQUIRED=true', () => {
        it('200', async () => {
          process.env.MQ_CONSUME_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          const token = 'token'
          await prepareWaitingMessage(namespace, id, 'text/plain', 'payload')
          AccessControlDAO.TokenPolicy.setConsumeTokenRequired(namespace, true)
          AccessControlDAO.Token.setConsumeToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages`)
          ))

          expect(res.status).toBe(200)
        })
      })
    })
  })
})
