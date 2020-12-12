import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'

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
      const result = await Core.TBAC.TokenPolicy.getAllIds()
      reply.send(result)
    }
  )

  server.get<{
    Params: { id: string }
  }>(
    '/mq/:id/token-policies'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
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
          , clearTokenRequired: {
              oneOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const result = await Core.TBAC.TokenPolicy.get(id)
      reply.send(result)
    }
  )

  server.put<{
    Params: { id: string }
    Body: boolean
  }>(
    '/mq/:id/token-policies/produce-token-required'
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
      await Core.TBAC.TokenPolicy.setProduceTokenRequired(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/mq/:id/token-policies/produce-token-required'
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
      await Core.TBAC.TokenPolicy.unsetProduceTokenRequired(id)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { id: string }
    Body: boolean
  }>(
    '/mq/:id/token-policies/consume-token-required'
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
      await Core.TBAC.TokenPolicy.setConsumeTokenRequired(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/mq/:id/token-policies/consume-token-required'
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
      await Core.TBAC.TokenPolicy.unsetConsumeTokenRequired(id)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { id: string }
    Body: boolean
  }>(
    '/mq/:id/token-policies/clear-token-required'
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
      await Core.TBAC.TokenPolicy.setClearTokenRequired(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string}
  }>(
    '/mq/:id/token-policies/clear-token-required'
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
      await Core.TBAC.TokenPolicy.unsetClearTokenRequired(id)
      reply.status(204).send()
    }
  )
}
