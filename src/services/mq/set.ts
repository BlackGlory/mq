import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, idSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  // overwrite application/json parser
  server.addContentTypeParser(
    'application/json'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body)
  )

  server.addContentTypeParser(
    '*'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body)
  )

  server.put<{
    Params: { namespace: string; id: string }
    Body: string
  }>(
    '/mq/:namespace/messages/:id'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            namespace: namespaceSchema
          , id: idSchema
          }
        , required: ['namespace', 'id']
        }
      , body: { type: 'string' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const id = req.params.id
      const payload = req.body
      const type = req.headers['content-type'] ?? 'application/octet-stream'

      try {
        api.MQ.set(namespace, id, type, payload)
        return reply
          .status(204)
          .send()
      } catch (e) {
        if (e instanceof api.MQ.NotFound) return reply.status(404).send()
        if (e instanceof api.MQ.BadMessageState) return reply.status(409).send()
        if (e instanceof api.MQ.DuplicatePayload) return reply.status(409).send()
        throw e
      }
    }
  )
}
