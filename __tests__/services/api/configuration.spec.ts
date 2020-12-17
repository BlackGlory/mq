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

describe('Configuration', () => {
  describe('GET /api/mq-with-configurations', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/mq-with-configurations'
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
        , url: '/api/mq-with-configurations'
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
        , url: '/api/mq-with-configurations'
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('GET /api/mq/:id/configurations', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/mq/${id}/configurations`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
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
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/mq/${id}/configurations`
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
        , url: `/api/mq/${id}/configurations`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/configurations/unique', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/unique`
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
        , url: `/api/mq/${id}/configurations/unique`
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
        , url: `/api/mq/${id}/configurations/unique`
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

  describe('DELETE /api/mq/:id/configurations/unique', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/configurations/unique`
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
        , url: `/api/mq/${id}/configurations/unique`
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
        , url: `/api/mq/${id}/configurations/unique`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })


  describe('PUT /api/mq/:id/configurations/drafting-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = 100

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/drafting-timeout`
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
        const val = 100

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/drafting-timeout`
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
        const val = 100

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/drafting-timeout`
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

  describe('DELETE /api/mq/:id/configurations/drafting-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/configurations/drafting-timeout`
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
        , url: `/api/mq/${id}/configurations/drafting-timeout`
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
        , url: `/api/mq/${id}/configurations/drafting-timeout`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/configurations/ordered-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = 100

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/ordered-timeout`
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
        const val = 100

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/ordered-timeout`
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
        const val = 100

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/ordered-timeout`
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

  describe('DELETE /api/mq/:id/configurations/ordered-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/configurations/ordered-timeout`
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
        , url: `/api/mq/${id}/configurations/ordered-timeout`
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
        , url: `/api/mq/${id}/configurations/ordered-timeout`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/configurations/active-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = 100

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/active-timeout`
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
        const val = 100

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/active-timeout`
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
        const val = 100

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/active-timeout`
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

  describe('DELETE /api/mq/:id/configurations/active-timeout', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/configurations/active-timeout`
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
        , url: `/api/mq/${id}/configurations/active-timeout`
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
        , url: `/api/mq/${id}/configurations/active-timeout`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/configurations/concurrency', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = 100

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/concurrency`
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
        const val = 100

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/concurrency`
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
        const val = 100

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/concurrency`
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

  describe('DELETE /api/mq/:id/configurations/concurrency', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/configurations/concurrency`
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
        , url: `/api/mq/${id}/configurations/concurrency`
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
        , url: `/api/mq/${id}/configurations/concurrency`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mq/:id/configurations/throttle', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = { duration: 100, limit: 100 }

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/throttle`
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
        const val = { duration: 100, limit: 100 }

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/throttle`
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
        const val = { duration: 100, limit: 100 }

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mq/${id}/configurations/throttle`
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

  describe('DELETE /api/mq/:id/configurations/throttle', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MQ_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mq/${id}/configurations/throttle`
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
        , url: `/api/mq/${id}/configurations/throttle`
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
        , url: `/api/mq/${id}/configurations/throttle`
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
