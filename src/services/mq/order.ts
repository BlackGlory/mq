import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import { AbortController } from 'abort-controller'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{
    Params: { queueId: string }
    Querystring: { token?: string }
  }>(
    '/mq/:queueId/messages'
  , {
      schema: {
        params: { id: idSchema }
      , querystring: { token: tokenSchema }
      , response: {
          200: { type: 'null' }
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

      const controller = new AbortController()
      const result = await Core.MQ.order(queueId, controller.signal)
      reply.status(200).send(result)

      req.raw.on('close', () => controller.abort())
    }
  )
}
