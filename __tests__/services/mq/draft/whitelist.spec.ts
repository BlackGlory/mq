import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, json } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('namespace in whitelist', () => {
      it('200', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const payload = { priority: null }
        await AccessControlDAO.addWhitelistItem(namespace)

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages`)
        , json(payload)
        ))

        expect(res.status).toBe(200)
      })
    })

    describe('namespace not in whitelist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const payload = { priority: null }

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages`)
        , json(payload)
        ))

        expect(res.status).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('namespace not in whitelist', () => {
      it('200', async () => {
        const namespace = 'namespace'
        const payload = { priority: null }

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/mq/${namespace}/messages`)
        , json(payload)
        ))

        expect(res.status).toBe(200)
      })
    })
  })
})
