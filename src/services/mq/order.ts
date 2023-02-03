import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'
import { AbortController, AbortError } from 'extra-abort'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.get<{
    Params: { namespace: string }
  }>(
    '/mq/:namespace/messages'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const controller = new AbortController()

      req.raw.on('close', () => {
        controller.abort()
        api.MQ.PendingOrderControllerRegistry.unregister(namespace, controller)
      })

      try {
        api.MQ.PendingOrderControllerRegistry.register(namespace, controller)
        const result = await api.MQ.order(namespace, controller.signal)
        return reply
          .status(200)
          .send(result)
      } catch (e) {
        if (e instanceof AbortError) return reply.status(404).send()
        throw e
      } finally {
        api.MQ.PendingOrderControllerRegistry.unregister(namespace, controller)
      }
    }
  )
}
