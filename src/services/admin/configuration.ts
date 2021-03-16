import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/mq-with-config'
  , {
      schema: {
        response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = await Core.Configuration.getAllIds()
      reply.send(result)
    }
  )

  server.get<{
    Params: { id: string }
  }>(
    '/mq/:id/config'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
            unique: {
              anyOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          , draftingTimeout: {
              anyOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          , orderedTimeout: {
              anyOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          , activeTimeout: {
              anyOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          , concurrency: {
              anyOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          , throttle: {
              anyOf: [
                {
                  type: 'object'
                , properties: {
                    duration: { type: 'number' }
                  , limit: { type: 'number' }
                  }
                , required: ['duration', 'limit']
                }
              , { type: 'null' }
              ]
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const result = await Core.Configuration.get(id)
      reply.send(result)
    }
  )

  server.put<{
    Params: { id: string }
    Body: boolean
  }>(
    '/mq/:id/config/unique'
  , {
      schema: {
        params: { id: idSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const val = req.body
      await Core.Configuration.setUnique(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/mq/:id/config/unique'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.Configuration.unsetUnique(id)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { id: string }
    Body: number
  }>(
    '/mq/:id/config/drafting-timeout'
  , {
      schema: {
        params: { id: idSchema }
      , body: { type: 'number' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const val = req.body
      await Core.Configuration.setDraftingTimeout(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/mq/:id/config/drafting-timeout'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.Configuration.unsetDraftingTimeout(id)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { id: string }
    Body: number
  }>(
    '/mq/:id/config/ordered-timeout'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const val = req.body
      await Core.Configuration.setOrderedTimeout(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/mq/:id/config/ordered-timeout'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.Configuration.unsetOrderedTimeout(id)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { id: string }
    Body: number
  }>(
    '/mq/:id/config/active-timeout'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const val = req.body
      await Core.Configuration.setActiveTimeout(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/mq/:id/config/active-timeout'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.Configuration.unsetActiveTimeout(id)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { id: string }
    Body: number
  }>(
    '/mq/:id/config/concurrency'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const val = req.body
      await Core.Configuration.setConcurrency(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/mq/:id/config/concurrency'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.Configuration.unsetConcurrency(id)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { id: string }
    Body: {
      duration: number
      limit: number
    }
  }>(
    '/mq/:id/config/throttle'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const val = req.body
      await Core.Configuration.setThrottle(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/mq/:id/config/throttle'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.Configuration.unsetThrottle(id)
      reply.status(204).send()
    }
  )
}
