import { ImplementationOf } from 'delight-rpc'
import * as Configuration from './configuration.js'
import { IAPI } from '@src/contract.js'
import { abandon } from './abandon.js'
import { complete } from './complete.js'
import { draft } from './draft.js'
import { fail } from './fail.js'
import { get } from './get.js'
import { getAllFailedMessageIds } from './get-all-failed-message-ids.js'
import { getAllNamespaces } from './get-all-namespaces.js'
import { order } from './order.js'
import { renew } from './renew.js'
import { renewAllFailedMessages } from './renew-all-failed-messages.js'
import { set } from './set.js'
import { stats } from './stats.js'
import { clear } from './clear.js'
import { abandonAllFailedMessages } from './abandon-all-failed-messages.js'

export const API: ImplementationOf<IAPI> = {
  MQ: {
    abandon
  , abandonAllFailedMessages
  , clear
  , complete
  , draft
  , fail
  , get
  , getAllFailedMessageIds
  , getAllNamespaces
  , order
  , renew
  , renewAllFailedMessages
  , set
  , stats
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
