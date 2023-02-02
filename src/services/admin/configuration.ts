import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
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
      const result = await api.Configuration.getAllNamespaces()
      return reply.send(result)
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
            unique: { type: 'boolean', nullable: true }
          , draftingTimeout: { type: 'number', nullable: true }
          , orderedTimeout: { type: 'number', nullable: true }
          , activeTimeout: { type: 'number', nullable: true }
          , concurrency: { type: 'number', nullable: true }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = await api.Configuration.get(namespace)
      return reply.send(result)
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
      await api.Configuration.setUnique(namespace, val)
      return reply
        .status(204)
        .send()
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
      await api.Configuration.unsetUnique(namespace)
      return reply
        .status(204)
        .send()
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
      await api.Configuration.setDraftingTimeout(namespace, val)
      return reply
        .status(204)
        .send()
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
      await api.Configuration.unsetDraftingTimeout(namespace)
      return reply
        .status(204)
        .send()
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
      await api.Configuration.setOrderedTimeout(namespace, val)
      return reply
        .status(204)
        .send()
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
      await api.Configuration.unsetOrderedTimeout(namespace)
      return reply
        .status(204)
        .send()
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
      await api.Configuration.setActiveTimeout(namespace, val)
      return reply
        .status(204)
        .send()
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
      await api.Configuration.unsetActiveTimeout(namespace)
      return reply
        .status(204)
        .send()
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
      await api.Configuration.setConcurrency(namespace, val)
      return reply
        .status(204)
        .send()
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
      await api.Configuration.unsetConcurrency(namespace)
      return reply
        .status(204)
        .send()
    }
  )
}
