import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { tokenSchema } from '@src/schema'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('TBAC', () => {
  describe('GET /api/mq-with-tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/mq-with-tokens'
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/mq-with-tokens'
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/mq-with-tokens'
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('GET /api/mq/:id/tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/mq/${id}/tokens`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
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
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/mq/${id}/tokens`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/mq/${id}/tokens`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/tokens/:token/produce', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/tokens/${token}/produce`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/tokens/${token}/produce`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/tokens/${token}/produce`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/tokens/:token/produce', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/tokens/${token}/produce`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/tokens/${token}/produce`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/tokens/${token}/produce`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/tokens/:token/consume', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/tokens/${token}/consume`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/tokens/${token}/consume`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/tokens/${token}/consume`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/tokens/:token/consume', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/tokens/${token}/consume`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/tokens/${token}/consume`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/tokens/${token}/consume`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/tokens/:token/clear', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/tokens/${token}/clear`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/tokens/${token}/clear`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/tokens/${token}/clear`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/tokens/:token/clear', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/tokens/${token}/clear`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/tokens/${token}/clear`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/tokens/${token}/clear`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })
})

function createAuthHeaders(adminPassword?: string) {
  return {
    'Authorization': `Bearer ${ adminPassword ?? process.env.MQ_ADMIN_PASSWORD }`
  }
}
