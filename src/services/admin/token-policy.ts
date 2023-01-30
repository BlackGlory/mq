import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/mq-with-token-policies'
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
      const result = await Core.TBAC.TokenPolicy.getAllNamespaces()
      return reply.send(result)
    }
  )

  server.get<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace/token-policies'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: {
            produceTokenRequired: { type: 'boolean', nullable: true }
          , consumeTokenRequired: { type: 'boolean', nullable: true }
          , clearTokenRequired: { type: 'boolean', nullable: true }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = await Core.TBAC.TokenPolicy.get(namespace)
      return reply.send(result)
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: boolean
  }>(
    '/mq/:namespace/token-policies/produce-token-required'
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
      await Core.TBAC.TokenPolicy.setProduceTokenRequired(namespace, val)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace/token-policies/produce-token-required'
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
      await Core.TBAC.TokenPolicy.unsetProduceTokenRequired(namespace)
      return reply
        .status(204)
        .send()
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: boolean
  }>(
    '/mq/:namespace/token-policies/consume-token-required'
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
      await Core.TBAC.TokenPolicy.setConsumeTokenRequired(namespace, val)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace/token-policies/consume-token-required'
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
      await Core.TBAC.TokenPolicy.unsetConsumeTokenRequired(namespace)
      return reply
        .status(204)
        .send()
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: boolean
  }>(
    '/mq/:namespace/token-policies/clear-token-required'
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
      await Core.TBAC.TokenPolicy.setClearTokenRequired(namespace, val)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { namespace: string}
  }>(
    '/mq/:namespace/token-policies/clear-token-required'
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
      await Core.TBAC.TokenPolicy.unsetClearTokenRequired(namespace)
      return reply
        .status(204)
        .send()
    }
  )
}
