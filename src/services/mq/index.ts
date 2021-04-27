import { FastifyPluginAsync } from 'fastify'
import { routes as draftRoutes } from './draft'
import { routes as setRoutes } from './set'
import { routes as orderRoutes } from './order'
import { routes as getRoutes } from './get'
import { routes as abandonRoutes } from './abandon'
import { routes as completeRoutes } from './complete'
import { routes as failRoutes } from './fail'
import { routes as renewRoutes } from './renew'
import { routes as abandonAllFailedMessages } from './abandon-all-failed-messages'
import { routes as renewAllFailedMessages } from './renew-all-failed-messages'
import { routes as clearRoutes } from './clear'
import { routes as statsRoutes } from './stats'
import { routes as getAllFailedMessageIdsRoutes } from './get-all-failed-message-ids'
import { routes as getAllQueueIdsRoutes } from './get-all-namespaces'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(draftRoutes, { Core })
  server.register(setRoutes, { Core })
  server.register(orderRoutes, { Core })
  server.register(getRoutes, { Core })
  server.register(abandonRoutes, { Core })
  server.register(completeRoutes, { Core })
  server.register(failRoutes, { Core })
  server.register(renewRoutes, { Core })
  server.register(abandonAllFailedMessages, { Core })
  server.register(renewAllFailedMessages, { Core })
  server.register(clearRoutes, { Core })
  server.register(statsRoutes, { Core })
  server.register(getAllFailedMessageIdsRoutes, { Core })
  server.register(getAllQueueIdsRoutes, { Core })
}
