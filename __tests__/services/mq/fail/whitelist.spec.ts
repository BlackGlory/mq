import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import { prepareActiveMessage } from './utils.js'
import { fetch } from 'extra-fetch'
import { patch } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('namespace in whitelist', () => {
      it('204', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const id = 'message-id'
        await prepareActiveMessage(namespace, id, 'text/plain', 'payload')
        AccessControlDAO.Whitelist.addWhitelistItem(namespace)

        const res = await fetch(patch(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}/fail`)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('namespace not in whitelist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const id = 'message-id'
        await prepareActiveMessage(namespace, id, 'text/plain', 'payload')

        const res = await fetch(patch(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}/fail`)
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
        await prepareActiveMessage(namespace, id, 'text/plain', 'payload')

        const res = await fetch(patch(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}/fail`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })
})
