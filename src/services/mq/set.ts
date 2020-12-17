import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import { JSON_PAYLOAD_ONLY, SET_PAYLOAD_LIMIT } from '@env'
import { CustomError } from '@blackglory/errors'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
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
    Params: { queueId: string; messageId: string }
    Querystring: { token?: string }
    Body: string
  }>(
    '/mq/:queueId/messages/:messageId'
  , {
      schema: {
        params: { id: idSchema }
      , querystring: { token: tokenSchema }
      , headers: {
          'content-type': JSON_PAYLOAD_ONLY()
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
      const queueId = req.params.queueId
      const messageId = req.params.messageId
      const payload = req.body
      const token = req.query.token
      const type = req.headers['content-type'] ?? 'application/octet-stream'

      try {
        await Core.Blacklist.check(queueId)
        await Core.Whitelist.check(queueId)
        await Core.TBAC.checkProducePermission(queueId, token)
        if (Core.JsonSchema.isEnabled()) {
          if (isJSONPayload()) {
            await Core.JsonSchema.validate(queueId, payload)
          } else {
            if (await Core.JsonSchema.get(queueId)) {
              throw new BadContentType('application/json')
            }
          }
        }
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        if (e instanceof Core.JsonSchema.InvalidPayload) return reply.status(400).send()
        if (e instanceof BadContentType) return reply.status(415).send()
        throw e
      }

      await Core.MQ.set(queueId, messageId, type, payload)
      reply.status(204).send()

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
