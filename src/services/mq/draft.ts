import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.post<{
    Params: { namespace: string }
    Body: { priority: number | null }
  }>(
    '/mq/:namespace/messages'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , body: {
          type: 'object'
        , properties: {
            priority: {
              type: 'integer'
            , minimum: 0
            , nullable: true
            }
          }
        , required: ['priority']
        }
      , response: {
          200: { type: 'string' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const priority = req.body.priority

      const result = api.MQ.draft(namespace, priority ?? undefined)
      return reply
        .status(200)
        .send(result)
    }
  )
}
