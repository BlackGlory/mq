import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema, idSchema } from '@src/schema.js'
import { JSON_PAYLOAD_ONLY, SET_PAYLOAD_LIMIT } from '@env/index.js'
import { CustomError } from '@blackglory/errors'
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
    Querystring: { token?: string }
    Body: string
  }>(
    '/mq/:namespace/messages/:id'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        , id: idSchema
        }
      , querystring: { token: tokenSchema }
      , headers: {
          'content-type':
            JSON_PAYLOAD_ONLY()
            ? { type: 'string', pattern: '^application/json' }
            : { type: 'string' }
        }
      , body: { type: 'string' }
      , response: {
          204: { type: 'null' }
        }
      }
    , bodyLimit: SET_PAYLOAD_LIMIT()
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const id = req.params.id
      const payload = req.body
      const token = req.query.token
      const type = req.headers['content-type'] ?? 'application/octet-stream'

      try {
        await api.Blacklist.check(namespace)
        await api.Whitelist.check(namespace)
        await api.TBAC.checkProducePermission(namespace, token)
        if (api.JsonSchema.isEnabled()) {
          if (isJSONPayload()) {
            await api.JsonSchema.validate(namespace, payload)
          } else {
            if (await api.JsonSchema.get(namespace)) {
              throw new BadContentType('application/json')
            }
          }
        }
      } catch (e) {
        if (e instanceof api.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof api.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof api.TBAC.Unauthorized) return reply.status(401).send()
        if (e instanceof api.JsonSchema.InvalidPayload) return reply.status(400).send()
        if (e instanceof BadContentType) return reply.status(415).send()
        throw e
      }

      try {
        await api.MQ.set(namespace, id, type, payload)
        return reply
          .status(204)
          .send()
      } catch (e) {
        if (e instanceof api.MQ.NotFound) return reply.status(404).send()
        if (e instanceof api.MQ.BadMessageState) return reply.status(409).send()
        if (e instanceof api.MQ.DuplicatePayload) return reply.status(409).send()
        throw e
      }

      function isJSONPayload(): boolean {
        const contentType = req.headers['content-type']
        if (!contentType) return false
        return contentType
          .toLowerCase()
          .startsWith('application/json')
      }
    }
  )
}

class BadContentType extends CustomError {
  constructor(contentType: string) {
    super(`Content-Type must be ${contentType}`)
  }
}
