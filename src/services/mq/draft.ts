import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.post<{
    Params: { queueId: string }
    Querystring: { token?: string }
    Body: { priority: number | null }
  }>(
    '/mq/:queueId/messages'
  , {
      schema: {
        params: { queueId: idSchema }
      , querystring: { token: tokenSchema }
      , body: {
          priority: {
            oneOf: [
              {
                type: 'integer'
              , minimum: 0
              }
            , { type: 'null' }
            ]
          }
        }
      , response: {
          200: { type: 'string' }
        }
      }
    }
  , async (req, reply) => {
      const queueId = req.params.queueId
      const token = req.query.token

      try {
        await Core.Blacklist.check(queueId)
        await Core.Whitelist.check(queueId)
        await Core.TBAC.checkProducePermission(queueId, token)
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      const result = await Core.MQ.draft(queueId)
      reply.status(204).send(result)
    }
  )
}
