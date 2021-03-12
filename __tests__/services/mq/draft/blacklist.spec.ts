import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, json } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('blacklist', () => {
  describe('enabled', () => {
    describe('id in blacklist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const mqId = 'mq-id'
        const payload = { priority: null }
        await AccessControlDAO.addBlacklistItem(mqId)

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/mq/${mqId}/messages`)
        , json(payload)
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('id not in blacklist', () => {
      it('200', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'blacklist'
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

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('200', async () => {
        const mqId = 'mq-id'
        const payload = { priority: null }
        await AccessControlDAO.addBlacklistItem(mqId)

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
