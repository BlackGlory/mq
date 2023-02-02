import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.post<{
    Params: { namespace: string }
    Querystring: { token?: string }
    Body: { priority: number | null }
  }>(
    '/mq/:namespace/messages'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , querystring: { token: tokenSchema }
      , body: {
          type: 'object'
        , properties: {
            priority: {
              type: 'integer'
            , minimum: 0
            , nullable: true
            }
          }
        , required: ['priority']
        }
      , response: {
          200: { type: 'string' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const priority = req.body.priority
      const token = req.query.token

      try {
        await api.Blacklist.check(namespace)
        await api.Whitelist.check(namespace)
        await api.TBAC.checkProducePermission(namespace, token)
      } catch (e) {
        if (e instanceof api.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof api.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof api.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      const result = await api.MQ.draft(namespace, priority ?? undefined)
      return reply
        .status(200)
        .send(result)
    }
  )
}
