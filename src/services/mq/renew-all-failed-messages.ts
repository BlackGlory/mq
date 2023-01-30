import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema } from '@src/schema.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.patch<{
    Params: { namespace: string }
    Querystring: { token?: string }
  }>(
    '/mq/:namespace/failed-messages/renew'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , querystring: { token: tokenSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.query.token

      try {
        await Core.Blacklist.check(namespace)
        await Core.Whitelist.check(namespace)
        await Core.TBAC.checkConsumePermission(namespace, token)
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      await Core.MQ.renewAllFailedMessages(namespace)
      return reply
        .status(204)
        .send()
    }
  )
}
