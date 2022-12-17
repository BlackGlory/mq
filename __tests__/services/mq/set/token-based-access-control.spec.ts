import { startService, stopService, getAddress } from '@test/utils'
import { AccessControlDAO } from '@dao'
import { prepareDraftingMessage } from './utils'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, searchParam, json } from 'extra-request/lib/es2018/transformers'

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
          const payload = 'payload'
          const token = 'token'
          await prepareDraftingMessage(namespace, id)
          await AccessControlDAO.setProduceTokenRequired(namespace, true)
          await AccessControlDAO.setProduceToken({ namespace, token })

          const res = await fetch(put(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages/${id}`)
          , searchParam('token', token)
          , json(payload)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          const payload = 'payload'
          const token = 'token'
          await prepareDraftingMessage(namespace, id)
          await AccessControlDAO.setProduceTokenRequired(namespace, true)
          await AccessControlDAO.setProduceToken({ namespace, token })

          const res = await fetch(put(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages/${id}`)
          , searchParam('token', 'bad')
          , json(payload)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          const payload = 'payload'
          const token = 'token'
          await prepareDraftingMessage(namespace, id)
          await AccessControlDAO.setProduceTokenRequired(namespace, true)
          await AccessControlDAO.setProduceToken({ namespace, token })

          const res = await fetch(put(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages/${id}`)
          , json(payload)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need produce tokens', () => {
      describe('PRODUCE_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.MQ_PRODUCE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          const payload = 'payload'
          await prepareDraftingMessage(namespace, id)

          const res = await fetch(put(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages/${id}`)
          , json(payload)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('PRODUCE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          const payload = 'payload'
          await prepareDraftingMessage(namespace, id)

          const res = await fetch(put(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages/${id}`)
          , json(payload)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('id need produce tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const namespace = 'namespace'
          const id = 'message-id'
          const payload = 'payload'
          const token = 'token'
          await prepareDraftingMessage(namespace, id)
          await AccessControlDAO.setProduceTokenRequired(namespace, true)
          await AccessControlDAO.setProduceToken({ namespace, token })

          const res = await fetch(put(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages/${id}`)
          , json(payload)
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('namespace does not need produce tokens', () => {
      describe('PRODUCE_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.MQ_PRODUCE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const id = 'message-id'
          const payload = 'payload'
          const token = 'token'
          await prepareDraftingMessage(namespace, id)
          await AccessControlDAO.setProduceTokenRequired(namespace, true)
          await AccessControlDAO.setProduceToken({ namespace, token })

          const res = await fetch(put(
            url(getAddress())
          , pathname(`/mq/${namespace}/messages/${id}`)
          , json(payload)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})
