import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  // get all ids
  server.get<{ Params: { id: string }}>(
    '/mq-with-tokens'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = await Core.TBAC.Token.getAllIds()
      reply.send(result)
    }
  )

  // get all tokens
  server.get<{
    Params: { id: string }
  }>(
    '/mq/:id/tokens'
  , {
      schema: {
        params: { id: idSchema }
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
      const id = req.params.id
      const result = await Core.TBAC.Token.getAll(id)
      reply.send(result)
    }
  )

  // produce token
  server.put<{
    Params: { token: string, id: string }
  }>(
    '/mq/:id/tokens/:token/produce'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.Token.setProduceToken(id, token)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id: string }
  }>(
    '/mq/:id/tokens/:token/produce'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.Token.unsetProduceToken(id, token)
      reply.status(204).send()
    }
  )

  // consume token
  server.put<{
    Params: { token: string, id : string }
  }>(
    '/mq/:id/tokens/:token/consume'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.Token.setConsumeToken(id, token)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id : string }
  }>(
    '/mq/:id/tokens/:token/consume'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.Token.unsetConsumeToken(id, token)
      reply.status(204).send()
    }
  )

  // clear token
  server.put<{
    Params: { token: string, id : string }
  }>(
    '/mq/:id/tokens/:token/clear'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.Token.setClearToken(id, token)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id : string }
  }>(
    '/mq/:id/tokens/:token/clear'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.Token.unsetClearToken(id, token)
      reply.status(204).send()
    }
  )
}
