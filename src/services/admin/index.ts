import { FastifyPluginAsync } from 'fastify'
import { routes as configurationRoutes } from './configuration.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.addContentTypeParser(
    'application/x-www-form-urlencoded'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body)
  )

  await server.register(configurationRoutes, { prefix: '/admin', api })
}
