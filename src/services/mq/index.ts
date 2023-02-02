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
  await server.register(draftRoutes, { api })
  await server.register(setRoutes, { api })
  await server.register(orderRoutes, { api })
  await server.register(getRoutes, { api })
  await server.register(abandonRoutes, { api })
  await server.register(completeRoutes, { api })
  await server.register(failRoutes, { api })
  await server.register(renewRoutes, { api })
  await server.register(abandonAllFailedMessages, { api })
  await server.register(renewAllFailedMessages, { api })
  await server.register(clearRoutes, { api })
  await server.register(statsRoutes, { api })
  await server.register(getAllFailedMessageIdsRoutes, { api })
  await server.register(getAllNamespacesRoutes, { api })
}
