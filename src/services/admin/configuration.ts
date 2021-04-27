import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema'

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
      const result = await Core.Configuration.getAllNamespaces()
      reply.send(result)
    }
  )

  server.get<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace/config'
  , {
      schema: {
        params: { namespace: namespaceSchema }
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
      const namespace = req.params.namespace
      const result = await Core.Configuration.get(namespace)
      reply.send(result)
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: boolean
  }>(
    '/mq/:namespace/config/unique'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.Configuration.setUnique(namespace, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace/config/unique'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      await Core.Configuration.unsetUnique(namespace)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: number
  }>(
    '/mq/:namespace/config/drafting-timeout'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , body: { type: 'number' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.Configuration.setDraftingTimeout(namespace, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace/config/drafting-timeout'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      await Core.Configuration.unsetDraftingTimeout(namespace)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: number
  }>(
    '/mq/:namespace/config/ordered-timeout'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.Configuration.setOrderedTimeout(namespace, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace/config/ordered-timeout'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      await Core.Configuration.unsetOrderedTimeout(namespace)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: number
  }>(
    '/mq/:namespace/config/active-timeout'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.Configuration.setActiveTimeout(namespace, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace/config/active-timeout'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      await Core.Configuration.unsetActiveTimeout(namespace)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: number
  }>(
    '/mq/:namespace/config/concurrency'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.Configuration.setConcurrency(namespace, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace/config/concurrency'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      await Core.Configuration.unsetConcurrency(namespace)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: {
      duration: number
      limit: number
    }
  }>(
    '/mq/:namespace/config/throttle'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.Configuration.setThrottle(namespace, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace/config/throttle'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      await Core.Configuration.unsetThrottle(namespace)
      reply.status(204).send()
    }
  )
}
