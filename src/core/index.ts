import { isAdmin } from './admin'
import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as JsonSchema from './json-schema'
import { TBAC } from './token-based-access-control'
import * as MQ from './mq'
import * as Configuration from './configuration'

export const Core: ICore = {
  isAdmin
, MQ
, Configuration
, Blacklist
, Whitelist
, JsonSchema
, TBAC
}
