import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema } from '@src/schema.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
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
        await Core.Blacklist.check(namespace)
        await Core.Whitelist.check(namespace)
        await Core.TBAC.checkProducePermission(namespace, token)
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      const result = await Core.MQ.draft(namespace, priority ?? undefined)
      return reply
        .status(200)
        .send(result)
    }
  )
}
