import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{
    Params: { queueId: string }
    Querystring: { token?: string }
  }>(
    '/mq/:queueId/failed-messages'
  , {
      schema: {
        params: { queueId: idSchema }
      , querystring: { token: tokenSchema }
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
      const token = req.query.token

      try {
        await Core.Blacklist.check(queueId)
        await Core.Whitelist.check(queueId)
        await Core.TBAC.checkConsumePermission(queueId, token)
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      const result = Core.MQ.getAllFailedMessageIds(queueId)
      return reply.status(200).send(result)
    }
  )
}
