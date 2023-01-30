import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/whitelist'
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
      const result = await Core.Whitelist.getAll()
      return reply.send(result)
    }
  )

  server.put<{ Params: { namespace: string }}>(
    '/whitelist/:namespace'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      await Core.Whitelist.add(namespace)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{ Params: { namespace: string }}>(
    '/whitelist/:namespace'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      await Core.Whitelist.remove(namespace)
      return reply
        .status(204)
        .send()
    }
  )
}
