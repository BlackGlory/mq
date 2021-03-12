import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, searchParam, json } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need delete tokens', () => {
      describe('token matched', () => {
        it('200', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const token = 'token'
          const payload = { priority: null }
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/mq/${mqId}/messages`)
          , searchParam('token', token)
          , json(payload)
          ))

          expect(res.status).toBe(200)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const token = 'token'
          const payload = { priority: null }
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/mq/${mqId}/messages`)
          , searchParam('token', 'bad')
          , json(payload)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const token = 'token'
          const payload = { priority: null }
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/mq/${mqId}/messages`)
          , json(payload)
          ))

          expect(res.status).toBe(401)
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

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/mq/${mqId}/messages`)
          , json(payload)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('PRODUCE_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.MQ_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const mqId = 'mq-id'
          const payload = { priority: null }

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/mq/${mqId}/messages`)
          , json(payload)
          ))

          expect(res.status).toBe(200)
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
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/mq/${mqId}/messages`)
          , json(payload)
          ))

          expect(res.status).toBe(200)
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
          await AccessControlDAO.setProduceTokenRequired(mqId, true)
          await AccessControlDAO.setProduceToken({ id: mqId, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/mq/${mqId}/messages`)
          , json(payload)
          ))

          expect(res.status).toBe(200)
        })
      })
    })
  })
})
