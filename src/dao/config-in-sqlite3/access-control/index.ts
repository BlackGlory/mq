import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as Token from './token'
import * as TokenPolicy from './token-policy'


const BlacklistDAO: IBlacklistDAO = {
  addBlacklistItem: asyncify(Blacklist.addBlacklistItem)
, getAllBlacklistItems: asyncify(Blacklist.getAllBlacklistItems)
, inBlacklist: asyncify(Blacklist.inBlacklist)
, removeBlacklistItem: asyncify(Blacklist.removeBlacklistItem)
}

const WhitelistDAO: IWhitelistDAO = {
  addWhitelistItem: asyncify(Whitelist.addWhitelistItem)
, getAllWhitelistItems: asyncify(Whitelist.getAllWhitelistItems)
, inWhitelist: asyncify(Whitelist.inWhitelist)
, removeWhitelistItem: asyncify(Whitelist.removeWhitelistItem)
}

const TokenDAO: ITokenDAO = {
  getAllIdsWithTokens: asyncify(Token.getAllIdsWithTokens)
, getAllTokens: asyncify(Token.getAllTokens)

, hasProduceTokens: asyncify(Token.hasProduceTokens)
, matchProduceToken: asyncify(Token.matchProduceToken)
, setProduceToken: asyncify(Token.setProduceToken)
, unsetProduceToken: asyncify(Token.unsetProduceToken)

, hasConsumeTokens: asyncify(Token.hasConsumeTokens)
, matchConsumeToken: asyncify(Token.matchConsumeToken)
, setConsumeToken: asyncify(Token.setConsumeToken)
, unsetConsumeToken: asyncify(Token.unsetConsumeToken)

, matchClearToken: asyncify(Token.matchClearToken)
, setClearToken: asyncify(Token.setClearToken)
, unsetClearToken: asyncify(Token.unsetClearToken)
}

const TokenPolicyDAO: ITokenPolicyDAO = {
  getAllIdsWithTokenPolicies: asyncify(TokenPolicy.getAllIdsWithTokenPolicies)
, getTokenPolicies: asyncify(TokenPolicy.getTokenPolicies)

, setProduceTokenRequired: asyncify(TokenPolicy.setProduceTokenRequired)
, unsetProduceTokenRequired: asyncify(TokenPolicy.unsetProduceTokenRequired)

, setConsumeTokenRequired: asyncify(TokenPolicy.setConsumeTokenRequired)
, unsetConsumeTokenRequired: asyncify(TokenPolicy.unsetConsumeTokenRequired)

, setClearTokenRequired: asyncify(TokenPolicy.setClearTokenRequired)
, unsetClearTokenRequired: asyncify(TokenPolicy.unsetClearTokenRequired)
}

export const AccessControlDAO: IAccessControlDAO = {
  ...BlacklistDAO
, ...WhitelistDAO
, ...TokenDAO
, ...TokenPolicyDAO
}

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}
