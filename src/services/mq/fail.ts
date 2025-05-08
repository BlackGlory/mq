import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, idSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.patch<{
    Params: { namespace: string; id: string }
  }>(
    '/mq/:namespace/messages/:id/fail'
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
        api.MQ.fail(namespace, id)
      } catch (e) {
        if (!(e instanceof api.MQ.BadMessageState)) throw e
      }
      return reply
        .status(204)
        .send()
    }
  )
}
