import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{ Params: { namespace: string }}>(
    '/mq/:namespace/stats'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: {
            namespace: { type: 'string' }
          , drafting: { type: 'integer', minimum: 0 }
          , waiting: { type: 'integer', minimum: 0 }
          , ordered: { type: 'integer', minimum: 0 }
          , active: { type: 'integer', minimum: 0 }
          , completed: { type: 'integer', minimum: 0 }
          , failed: { type: 'integer', mminimum: 0 }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = await Core.MQ.stats(namespace)
      return reply.send(result)
    }
  )
}
