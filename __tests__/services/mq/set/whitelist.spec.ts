import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { prepareDraftingMessage } from './utils'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, json } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('namespace in whitelist', () => {
      it('204', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const id = 'message-id'
        const payload = 'payload'
        await prepareDraftingMessage(namespace, id)
        await AccessControlDAO.addWhitelistItem(namespace)

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}`)
        , json(payload)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('namespace not in whitelist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const id = 'message-id'
        const payload = 'payload'
        await prepareDraftingMessage(namespace, id)

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}`)
        , json(payload)
        ))

        expect(res.status).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('namespace not in whitelist', () => {
      it('204', async () => {
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
