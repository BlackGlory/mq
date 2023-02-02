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
import { routes as getAllNamespacesRoutes } from './get-all-namespaces.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.register(draftRoutes, { api })
  server.register(setRoutes, { api })
  server.register(orderRoutes, { api })
  server.register(getRoutes, { api })
  server.register(abandonRoutes, { api })
  server.register(completeRoutes, { api })
  server.register(failRoutes, { api })
  server.register(renewRoutes, { api })
  server.register(abandonAllFailedMessages, { api })
  server.register(renewAllFailedMessages, { api })
  server.register(clearRoutes, { api })
  server.register(statsRoutes, { api })
  server.register(getAllFailedMessageIdsRoutes, { api })
  server.register(getAllNamespacesRoutes, { api })
}
