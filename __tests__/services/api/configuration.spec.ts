import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, headers, json } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('Configuration', () => {
  describe('GET /api/mq-with-configurations', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/api/mq-with-configurations')
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
        , pathname('/api/mq-with-configurations')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/api/mq-with-configurations')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('GET /api/mq/:id/configurations', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expect(await toJSON(res)).toMatchSchema({
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
          , throttle: {
              oneOf: [
                {
                  type: 'object'
                , properties: {
                    duration: { type: 'number' }
                  , limit: { type: 'number' }
                  }
                }
              , { type: 'null' }
              ]
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
        , pathname(`/api/mq/${id}/configurations`)
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
        , pathname(`/api/mq/${id}/configurations`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/configurations/unique', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/unique`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/unique`)
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/unique`)
        , json(val)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/configurations/unique', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/unique`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/unique`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/unique`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })


  describe('PUT /api/mq/:id/configurations/drafting-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/drafting-timeout`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/drafting-timeout`)
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/drafting-timeout`)
        , json(val)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/configurations/drafting-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/drafting-timeout`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/drafting-timeout`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/drafting-timeout`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/configurations/ordered-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/ordered-timeout`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/ordered-timeout`)
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/ordered-timeout`)
        , headers(createAuthHeaders('bad'))
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/configurations/ordered-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/ordered-timeout`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/ordered-timeout`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/ordered-timeout`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/configurations/active-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/active-timeout`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/active-timeout`)
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/active-timeout`)
        , headers(createAuthHeaders('bad'))
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/configurations/active-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/active-timeout`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/active-timeout`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/active-timeout`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/configurations/concurrency', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/concurrency`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/concurrency`)
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/concurrency`)
        , headers(createAuthHeaders('bad'))
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/configurations/concurrency', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/concurrency`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/concurrency`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/concurrency`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/configurations/throttle', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = { duration: 100, limit: 100 }

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/throttle`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const val = { duration: 100, limit: 100 }

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/throttle`)
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = { duration: 100, limit: 100 }

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/throttle`)
        , headers(createAuthHeaders('bad'))
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/configurations/throttle', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/throttle`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/throttle`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/mq/${id}/configurations/throttle`)
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
