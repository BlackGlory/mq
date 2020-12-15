import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('TokenPolicy', () => {
  describe('GET /api/mq-with-token-policies', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/mq-with-token-policies'
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
        , url: '/api/mq-with-token-policies'
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
        , url: '/api/mq-with-token-policies'
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('GET /api/mq/:id/token-policies', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/mq/${id}/token-policies`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
          type: 'object'
        , properties: {
            produceTokenRequired: {
              oneOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          , consumeTokenRequired: {
              oneOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
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
        , url: `/api/mq/${id}/token-policies`
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
        , url: `/api/mq/${id}/token-policies`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/token-policies/produce-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/token-policies/produce-token-required`
        , payload: JSON.stringify(val)
        , headers: {
            ...createJsonHeaders()
          , ...createAuthHeaders()
          }
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/token-policies/produce-token-required`
        , payload: JSON.stringify(val)
        , headers: {
            ...createJsonHeaders()
          }
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/token-policies/produce-token-required`
        , payload: JSON.stringify(val)
        , headers: {
            ...createJsonHeaders()
          , ...createAuthHeaders('bad')
          }
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/token-policies/consume-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/token-policies/consume-token-required`
        , payload: JSON.stringify(val)
        , headers: {
            ...createJsonHeaders()
          , ...createAuthHeaders()
          }
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/token-policies/consume-token-required`
        , payload: JSON.stringify(val)
        , headers: createJsonHeaders()
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/token-policies/consume-token-required`
        , payload: JSON.stringify(val)
        , headers: {
            ...createJsonHeaders()
          , ...createAuthHeaders('bad')
          }
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/token-policies/clear-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/token-policies/clear-token-required`
        , payload: JSON.stringify(val)
        , headers: {
            ...createJsonHeaders()
          , ...createAuthHeaders()
          }
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/token-policies/clear-token-required`
        , payload: JSON.stringify(val)
        , headers: createJsonHeaders()
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/token-policies/clear-token-required`
        , payload: JSON.stringify(val)
        , headers: {
            ...createJsonHeaders()
          , ...createAuthHeaders('bad')
          }
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/token-policies/produce-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/token-policies/produce-token-required`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/token-policies/produce-token-required`
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
          method: 'DELETE'
        , url: `/api/mq/${id}/token-policies/produce-token-required`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/token-policies/consume-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/token-policies/consume-token-required`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/token-policies/consume-token-required`
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
          method: 'DELETE'
        , url: `/api/mq/${id}/token-policies/consume-token-required`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/mq/:id/token-policies/clear-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/token-policies/clear-token-required`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/token-policies/clear-token-required`
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
          method: 'DELETE'
        , url: `/api/mq/${id}/token-policies/clear-token-required`
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

function createJsonHeaders() {
  return {
    'Content-Type': 'application/json'
  }
}
