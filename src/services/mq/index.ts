import { FastifyPluginAsync } from 'fastify'
import { routes as draftRoutes } from './draft.js'
import { routes as setRoutes } from './set.js'
import { routes as orderRoutes } from './order.js'
import { routes as getRoutes } from './get.js'
import { routes as abandonRoutes } from './abandon.js'
import { routes as completeRoutes } from './complete.js'
import { routes as failRoutes } from './fail.js'
import { routes as renewRoutes } from './renew.js'
import { routes as abandonAllFailedMessages } from './abandon-all-failed-messages.js'
import { routes as renewAllFailedMessages } from './renew-all-failed-messages.js'
import { routes as clearRoutes } from './clear.js'
import { routes as statsRoutes } from './stats.js'
import { routes as getAllFailedMessageIdsRoutes } from './get-all-failed-message-ids.js'
import { routes as getAllQueueIdsRoutes } from './get-all-namespaces.js'

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
