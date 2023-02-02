import * as Blacklist from './blacklist.js'
import * as Whitelist from './whitelist.js'
import * as Token from './token.js'
import * as TokenPolicy from './token-policy.js'
import { IAccessControlDAO, IBlacklistDAO, ITokenDAO, ITokenPolicyDAO, IWhitelistDAO } from './contract.js'

export const BlacklistDAO: IBlacklistDAO = Blacklist
export const WhitelistDAO: IWhitelistDAO = Whitelist
export const TokenDAO: ITokenDAO = Token
export const TokenPolicyDAO: ITokenPolicyDAO = TokenPolicy

export const AccessControlDAO: IAccessControlDAO = {
  Blacklist: BlacklistDAO
, Whitelist: WhitelistDAO
, Token: TokenDAO
, TokenPolicy: TokenPolicyDAO
}
