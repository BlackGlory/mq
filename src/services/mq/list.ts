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
  , async (req, reply) => {
      const result = await Core.MQ.list()
      reply.status(200).send(result)
    }
  )
}
