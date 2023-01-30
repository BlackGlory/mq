import { FastifyPluginAsync } from 'fastify'
import bearerAuthPlugin from '@fastify/bearer-auth'
import { routes as jsonSchemaRoutes } from './json-schema.js'
import { routes as blacklistRoutes } from './blacklist.js'
import { routes as whitelistRoutes } from './whitelist.js'
import { routes as tokenPolicyRoutes } from './token-policy.js'
import { routes as tokenRoutes } from './token.js'
import { routes as configurationRoutes } from './configuration.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.addContentTypeParser(
    'application/x-www-form-urlencoded'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body)
  )
  server.register(bearerAuthPlugin, {
    keys: new Set<string>() // because auth is a function, keys will be ignored.
  , auth(key, req) {
      return Core.isAdmin(key)
    }
  })

  server.register(jsonSchemaRoutes, { prefix: '/admin', Core })
  server.register(blacklistRoutes, { prefix: '/admin', Core })
  server.register(whitelistRoutes, { prefix: '/admin', Core })
  server.register(tokenPolicyRoutes, { prefix: '/admin', Core })
  server.register(tokenRoutes, { prefix: '/admin', Core })
  server.register(configurationRoutes, { prefix: '/admin', Core })
}
