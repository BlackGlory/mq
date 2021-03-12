import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { prepareFailedMessage } from './utils'
import { fetch } from 'extra-fetch'
import { patch } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'

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
        const messageId = 'message-id'
        await prepareFailedMessage(mqId, messageId, 'text/plain', 'payload')
        await AccessControlDAO.addBlacklistItem(mqId)

        const res = await fetch(patch(
          url(getAddress())
        , pathname(`/mq/${mqId}/messages/${messageId}/renew`)
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('id not in blacklist', () => {
      it('204', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const mqId = 'mq-id'
        const messageId = 'message-id'
        await prepareFailedMessage(mqId, messageId, 'text/plain', 'payload')

        const res = await fetch(patch(
          url(getAddress())
        , pathname(`/mq/${mqId}/messages/${messageId}/renew`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('204', async () => {
        const mqId = 'mq-id'
        const messageId = 'message-id'
        await prepareFailedMessage(mqId, messageId, 'text/plain', 'payload')
        await AccessControlDAO.addBlacklistItem(mqId)

        const res = await fetch(patch(
          url(getAddress())
        , pathname(`/mq/${mqId}/messages/${messageId}/renew`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })
})
