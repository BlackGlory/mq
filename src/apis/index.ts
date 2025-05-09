import { ImplementationOf } from 'delight-rpc'
import * as MQ from './mq.js'
import * as Configuration from './configuration.js'
import { IAPI } from '@src/contract.js'

export const API: ImplementationOf<IAPI> = {
  MQ: {
    abandon: MQ.abandon
  , abandonAllFailedMessages: MQ.abandonAllFailedMessages
  , clear: MQ.clear
  , complete: MQ.complete
  , draft: MQ.draft
  , fail: MQ.fail
  , get: MQ.get
  , getAllFailedMessageIds: MQ.getAllFailedMessageIds
  , getAllNamespaces: MQ.getAllNamespaces
  , nextTick: MQ.nextTick
  , order: MQ.order
  , renew: MQ.renew
  , renewAllFailedMessages: MQ.renewAllFailedMessages
  , set: MQ.set
  , stats: MQ.stats
  , PendingOrderControllerRegistry: {
      abortAll: MQ.PendingOrderControllerRegistry.abortAll
    , register: MQ.PendingOrderControllerRegistry.register
    , unregister: MQ.PendingOrderControllerRegistry.unregister
    }
  }
, Configuration: {
    get: Configuration.get
  , getAllNamespaces: Configuration.getAllNamespaces
  , setActiveTimeout: Configuration.setActiveTimeout
  , setConcurrency: Configuration.setConcurrency
  , setDraftingTimeout: Configuration.setDraftingTimeout
  , setOrderedTimeout: Configuration.setOrderedTimeout
  , setUnique: Configuration.setUnique
  , unsetActiveTimeout: Configuration.unsetActiveTimeout
  , unsetConcurrency: Configuration.unsetConcurrency
  , unsetDraftingTimeout: Configuration.unsetDraftingTimeout
  , unsetOrderedTimeout: Configuration.unsetOrderedTimeout
  , unsetUnique: Configuration.unsetUnique
  }
}
