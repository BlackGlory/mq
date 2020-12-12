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
            type: 'array'
          , items: { type: 'string' }
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
