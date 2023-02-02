import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  // get all namespaces
  server.get<{ Params: { namespace: string }}>(
    '/mq-with-tokens'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = await api.TBAC.Token.getAllNamespaces()
      return reply.send(result)
    }
  )

  // get all tokens
  server.get<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace/tokens'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: {
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
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = await api.TBAC.Token.getAll(namespace)
      return reply.send(result)
    }
  )

  // produce token
  server.put<{
    Params: { token: string, namespace: string }
  }>(
    '/mq/:namespace/tokens/:token/produce'
  , {
      schema: {
        params: {
          token: tokenSchema
        , namespace: namespaceSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.params.token
      await api.TBAC.Token.setProduceToken(namespace, token)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { token: string, namespace: string }
  }>(
    '/mq/:namespace/tokens/:token/produce'
  , {
      schema: {
        params: {
          token: tokenSchema
        , namespace: namespaceSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.params.token
      await api.TBAC.Token.unsetProduceToken(namespace, token)
      return reply
        .status(204)
        .send()
    }
  )

  // consume token
  server.put<{
    Params: { token: string, namespace : string }
  }>(
    '/mq/:namespace/tokens/:token/consume'
  , {
      schema: {
        params: {
          token: tokenSchema
        , namespace: namespaceSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.params.token
      await api.TBAC.Token.setConsumeToken(namespace, token)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { token: string, namespace : string }
  }>(
    '/mq/:namespace/tokens/:token/consume'
  , {
      schema: {
        params: {
          token: tokenSchema
        , namespace: namespaceSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.params.token
      await api.TBAC.Token.unsetConsumeToken(namespace, token)
      return reply
        .status(204)
        .send()
    }
  )

  // clear token
  server.put<{
    Params: { token: string, namespace : string }
  }>(
    '/mq/:namespace/tokens/:token/clear'
  , {
      schema: {
        params: {
          token: tokenSchema
        , namespace: namespaceSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.params.token
      await api.TBAC.Token.setClearToken(namespace, token)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { token: string, namespace : string }
  }>(
    '/mq/:namespace/tokens/:token/clear'
  , {
      schema: {
        params: {
          token: tokenSchema
        , namespace: namespaceSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.params.token
      await api.TBAC.Token.unsetClearToken(namespace, token)
      return reply
        .status(204)
        .send()
    }
  )
}
