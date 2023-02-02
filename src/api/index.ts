import { isAdmin } from './admin.js'
import * as Blacklist from './blacklist.js'
import * as Whitelist from './whitelist.js'
import * as JsonSchema from './json-schema.js'
import { TBAC } from './token-based-access-control/index.js'
import * as MQ from './mq.js'
import * as Configuration from './configuration.js'
import { IAPI } from './contract.js'

export const api: IAPI = {
  isAdmin
, MQ
, Configuration
, Blacklist
, Whitelist
, JsonSchema
, TBAC
}
