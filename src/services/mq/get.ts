import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema, idSchema } from '@src/schema.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{
    Params: { namespace: string; id: string }
    Querystring: { token?: string }
  }>(
    '/mq/:namespace/messages/:id'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        , id: idSchema
        }
      , querystring: { token: tokenSchema }
      , response: {
          200: { type: 'string' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const id = req.params.id
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

      try {
        const result = await Core.MQ.get(namespace, id)
        return reply
          .status(200)
          .header('Content-Type', result.type)
          .header('X-MQ-Priority', result.priority)
          .send(result.payload)
      } catch (e) {
        if (e instanceof Core.MQ.NotFound) return reply.status(404).send()
        if (e instanceof Core.MQ.BadMessageState) return reply.status(409).send()
        throw e
      }
    }
  )
}
