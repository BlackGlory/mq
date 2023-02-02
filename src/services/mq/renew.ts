import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema, idSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.patch<{
    Params: { namespace: string; id: string }
    Querystring: { token?: string }
  }>(
    '/mq/:namespace/messages/:id/renew'
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
        api.Blacklist.check(namespace)
        api.Whitelist.check(namespace)
        api.TBAC.checkConsumePermission(namespace, token)
      } catch (e) {
        if (e instanceof api.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof api.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof api.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      try {
        api.MQ.renew(namespace, id)
        return reply
          .status(204)
          .send()
      } catch (e) {
        if (e instanceof api.MQ.NotFound) return reply.status(404).send()
        if (e instanceof api.MQ.BadMessageState) return reply.status(409).send()
        throw e
      }
    }
  )
}
