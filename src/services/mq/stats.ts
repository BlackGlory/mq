import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{ Params: { queueId: string }}>(
    '/mq/:queueId/stats'
  , {
      schema: {
        params: { queueId: idSchema }
      , response: {
          200: {
            id: { type: 'string' }
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
      const queueId = req.params.queueId
      const result = await Core.MQ.stats(queueId)
      reply.send(result)
    }
  )
}
