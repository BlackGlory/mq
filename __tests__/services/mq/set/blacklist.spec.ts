import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import { prepareDraftingMessage } from './utils.js'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, json } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('blacklist', () => {
  describe('enabled', () => {
    describe('namespace in blacklist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        const id = 'message-id'
        const payload = 'payload'
        await prepareDraftingMessage(namespace, id)
        await AccessControlDAO.addBlacklistItem(namespace)

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}`)
        , json(payload)
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('namespace not in blacklist', () => {
      it('204', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'blacklist'
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

  describe('disabled', () => {
    describe('namespace in blacklist', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const id = 'message-id'
        const payload = 'payload'
        await prepareDraftingMessage(namespace, id)
        await AccessControlDAO.addBlacklistItem(namespace)

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
