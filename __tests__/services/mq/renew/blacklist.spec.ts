import { startService, stopService, getAddress } from '@test/utils'
import { AccessControlDAO } from '@dao'
import { prepareFailedMessage } from './utils'
import { fetch } from 'extra-fetch'
import { patch } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('blacklist', () => {
  describe('enabled', () => {
    describe('namespace in blacklist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        const id = 'message-id'
        await prepareFailedMessage(namespace, id, 'text/plain', 'payload')
        await AccessControlDAO.addBlacklistItem(namespace)

        const res = await fetch(patch(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}/renew`)
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('namespace not in blacklist', () => {
      it('204', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        const id = 'message-id'
        await prepareFailedMessage(namespace, id, 'text/plain', 'payload')

        const res = await fetch(patch(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}/renew`)
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
        await prepareFailedMessage(namespace, id, 'text/plain', 'payload')
        await AccessControlDAO.addBlacklistItem(namespace)

        const res = await fetch(patch(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages/${id}/renew`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })
})
