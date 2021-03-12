import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { tokenSchema } from '@src/schema'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, headers } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('TBAC', () => {
  describe('GET /api/mq-with-tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/api/mq-with-tokens')
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expect(await toJSON(res)).toMatchSchema({
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const res = await fetch(get(
          url(getAddress())
        , pathname('/api/mq-with-tokens')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/api/mq-with-tokens')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('GET /api/mq/:id/tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expect(await toJSON(res)).toMatchSchema({
          type: 'array'
        , items: {
            type: 'object'
          , properties: {
              token: tokenSchema
            , produce: { type: 'boolean' }
            , consume: { type: 'boolean' }
            , clear: { type: 'boolean' }
            }
          }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/tokens/:token/produce', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/produce`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/produce`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/produce`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/tokens/:token/produce', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/produce`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/produce`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/produce`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/tokens/:token/consume', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/consume`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/consume`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/consume`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/tokens/:token/consume', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/consume`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/consume`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/consume`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/tokens/:token/clear', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/clear`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/clear`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/clear`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/tokens/:token/clear', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/clear`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/clear`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/tokens/${token}/clear`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })
})

function createAuthHeaders(adminPassword?: string) {
  return {
    'Authorization': `Bearer ${ adminPassword ?? process.env.MQ_ADMIN_PASSWORD }`
  }
}
