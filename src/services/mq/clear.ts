import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.delete<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            namespace: namespaceSchema
          }
        , required: ['namespace']
        }
      , response: {
          200: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace

      api.MQ.clear(namespace)
      return reply
        .status(204)
        .send()
    }
  )
}
