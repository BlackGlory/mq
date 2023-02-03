import { isAdmin } from './admin.js'
import * as MQ from './mq.js'
import * as Configuration from './configuration.js'
import { IAPI } from './contract.js'

export const api: IAPI = {
  isAdmin
, MQ
, Configuration
}
