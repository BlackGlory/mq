import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/mq-with-configurations'
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
    '/mq/:id/configurations'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
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
    '/mq/:id/configurations/unique'
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
    '/mq/:id/configurations/unique'
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
    '/mq/:id/configurations/drafting-timeout'
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
    '/mq/:id/configurations/drafting-timeout'
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
    '/mq/:id/configurations/ordered-timeout'
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
    '/mq/:id/configurations/ordered-timeout'
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
    '/mq/:id/configurations/active-timeout'
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
    '/mq/:id/configurations/active-timeout'
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
    '/mq/:id/configurations/concurrency'
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
    '/mq/:id/configurations/concurrency'
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
    '/mq/:id/configurations/throttle'
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
    '/mq/:id/configurations/throttle'
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
