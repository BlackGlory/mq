import { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/mq'
  , {
      schema: {
        response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , (req, reply) => {
      const result = Core.MQ.getAllQueueIds()
      reply.status(200).send(result)
    }
  )
}
