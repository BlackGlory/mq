import { FastifyPluginAsync } from 'fastify'
import { routes as statsRoutes } from './stats'
import { routes as draftRoutes } from './draft'
import { routes as setRoutes } from './set'
import { routes as orderRoutes } from './order'
import { routes as getRoutes } from './get'
import { routes as completeRoutes } from './complete'
import { routes as abandonRoutes } from './abandon'
import { routes as clearRoutes } from './clear'
import { routes as listRoutes } from './list'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(statsRoutes, { Core })
  server.register(draftRoutes, { Core })
  server.register(setRoutes, { Core })
  server.register(orderRoutes, { Core })
  server.register(getRoutes, { Core })
  server.register(completeRoutes, { Core })
  server.register(abandonRoutes, { Core })
  server.register(clearRoutes, { Core })
  server.register(listRoutes, { Core })
}
