import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.patch<{
    Params: { queueId: string; messageId: string }
    Querystring: { token?: string }
  }>(
    '/mq/:queueId/messages/:messageId/complete'
  , {
      schema: {
        params: {
          queueId: idSchema
        , messageId: idSchema
        }
      , querystring: { token: tokenSchema }
      , response: {
          200: { type: 'string' }
        }
      }
    }
  , async (req, reply) => {
      const queueId = req.params.queueId
      const messageId = req.params.messageId
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

      try {
        await Core.MQ.complete(queueId, messageId)
      } catch (e) {
        if (!(e instanceof Core.MQ.BadMessageState)) throw e
      }
      return reply.status(204).send()
    }
  )
}
