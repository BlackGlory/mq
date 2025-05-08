import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, idSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.delete<{
    Params: { namespace: string; id: string }
  }>(
    '/mq/:namespace/messages/:id'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            namespace: namespaceSchema
          , id: idSchema
          }
        , required: ['namespace', 'id']
        }
      , response: {
          200: { type: 'string' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const id = req.params.id

      try {
        api.MQ.abandon(namespace, id)
        return reply
          .status(204)
          .send()
      } catch (e) {
        if (e instanceof api.MQ.NotFound) return reply.status(404).send()
        throw e
      }
    }
  )
}
