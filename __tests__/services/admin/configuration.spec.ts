import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { expectMatchSchema, startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, headers, json } from 'extra-request/transformers'
import { toJSON } from 'extra-response'

beforeEach(startService)
afterEach(stopService)

describe('Configuration', () => {
  describe('GET /admin/mq-with-config', () => {
    describe('auth', () => {
      it('200', async () => {
        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/mq-with-config')
        ))

        expect(res.status).toBe(200)
        expectMatchSchema(await toJSON(res), {
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })
  })

  describe('GET /admin/mq/:namespace/config', () => {
    describe('auth', () => {
      it('200', async () => {
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/mq/${namespace}/config`)
        ))

        expect(res.status).toBe(200)
        expectMatchSchema(await toJSON(res), {
          type: 'object'
        , properties: {
            unique: {
              oneOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          , draftingTimeout: {
              oneOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          , orderedTimeout: {
              oneOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          , activeTimeout: {
              oneOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          , concurrency: {
              oneOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          }
        })
      })
    })
  })

  describe('PUT /admin/mq/:namespace/config/unique', () => {
    describe('auth', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/mq/${namespace}/config/unique`)
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('DELETE /admin/mq/:namespace/config/unique', () => {
    describe('auth', () => {
      it('204', async () => {
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/mq/${namespace}/config/unique`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })


  describe('PUT /admin/mq/:namespace/config/drafting-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/mq/${namespace}/config/drafting-timeout`)
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('DELETE /admin/mq/:namespace/config/drafting-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/mq/${namespace}/config/drafting-timeout`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('PUT /admin/mq/:namespace/config/ordered-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/mq/${namespace}/config/ordered-timeout`)
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('DELETE /admin/mq/:namespace/config/ordered-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/mq/${namespace}/config/ordered-timeout`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('PUT /admin/mq/:namespace/config/active-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/mq/${namespace}/config/active-timeout`)
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('DELETE /admin/mq/:namespace/config/active-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/mq/${namespace}/config/active-timeout`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('PUT /admin/mq/:namespace/config/concurrency', () => {
    describe('auth', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/mq/${namespace}/config/concurrency`)
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('DELETE /admin/mq/:namespace/config/concurrency', () => {
    describe('auth', () => {
      it('204', async () => {
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/mq/${namespace}/config/concurrency`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })
})
