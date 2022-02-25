import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema } from '@src/schema'
import { AbortController, AbortError } from 'extra-abort'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{
    Params: { namespace: string }
    Querystring: { token?: string }
  }>(
    '/mq/:namespace/messages'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , querystring: { token: tokenSchema }
      , response: {
          200: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.query.token
      const controller = new AbortController()

      req.raw.on('close', () => {
        controller.abort()
        Core.MQ.PendingOrderControllerRegistry.unregister(namespace, controller)
      })

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
        Core.MQ.PendingOrderControllerRegistry.register(namespace, controller)
        const result = await Core.MQ.order(namespace, controller.signal)
        reply.status(200).send(result)
      } catch (e) {
        if (e instanceof AbortError) return reply.status(404).send()
        throw e
      } finally {
        Core.MQ.PendingOrderControllerRegistry.unregister(namespace, controller)
      }
    }
  )
}
