import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{
    Params: { queueId: string; messageId: string }
    Querystring: { token?: string }
  }>(
    '/mq/:queueId/messages/:messageId'
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
        if (e instanceof Core.Error.Unauthorized) return reply.status(401).send()
        if (e instanceof Core.Error.Forbidden) return reply.status(403).send()
        if (e instanceof Error) return reply.status(400).send(e.message)
        throw e
      }

      try {
        const result = await Core.MQ.get(queueId, messageId)
        reply
          .status(200)
          .header('Content-Type', result.type)
          .send(result.payload)
      } catch (e) {
        if (e instanceof Core.Error.NotFound) return reply.status(404).send()
        throw e
      }
    }
  )
}
