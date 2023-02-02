import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import { prepareOrderedMessage } from './utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('blacklist', () => {
  describe('enabled', () => {
    describe('namespace in blacklist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        const id = 'message-id'
        prepareOrderedMessage(namespace, id, 'text/plain', 'payload')
        AccessControlDAO.Blacklist.addBlacklistItem(namespace)

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}`)
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('namespace not in blacklist', () => {
      it('200', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        const id = 'message-id'
        prepareOrderedMessage(namespace, id, 'text/plain', 'payload')

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}`)
        ))

        expect(res.status).toBe(200)
      })
    })
  })

  describe('disabled', () => {
    describe('namespace in blacklist', () => {
      it('200', async () => {
        const namespace = 'namespace'
        const id = 'message-id'
        prepareOrderedMessage(namespace, id, 'text/plain', 'payload')
        AccessControlDAO.Blacklist.addBlacklistItem(namespace)

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}`)
        ))

        expect(res.status).toBe(200)
      })
    })
  })
})
