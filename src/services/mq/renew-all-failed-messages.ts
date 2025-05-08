import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.patch<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace/failed-messages/renew'
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
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace

      api.MQ.renewAllFailedMessages(namespace)
      return reply
        .status(204)
        .send()
    }
  )
}
