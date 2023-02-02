import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO, MQDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
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
        MQDAO.draftMessage(namespace, id)
        AccessControlDAO.Whitelist.addWhitelistItem(namespace)

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}`)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('namespace not in whitelist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const id = 'message-id'
        MQDAO.draftMessage(namespace, id)

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}`)
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
        MQDAO.draftMessage(namespace, id)

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })
})
