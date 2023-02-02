import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.get(
    '/blacklist'
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
      const result = api.Blacklist.getAll()
      return reply.send(result)
    }
  )

  server.put<{ Params: { namespace: string }}>(
    '/blacklist/:namespace'
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
      api.Blacklist.add(namespace)
      return reply.status(204).send()
    }
  )

  server.delete<{ Params: { namespace: string }}>(
    '/blacklist/:namespace'
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
      api.Blacklist.remove(namespace)
      return reply
        .status(204)
        .send()
    }
  )
}
