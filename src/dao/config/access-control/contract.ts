import { ITokenInfo, ITokenPolicy } from '@api/contract.js'
export { ITokenInfo, ITokenPolicy } from '@api/contract.js'

export interface IAccessControlDAO {
  Blacklist: IBlacklistDAO
  Whitelist: IWhitelistDAO
  Token: ITokenDAO
  TokenPolicy: ITokenPolicyDAO
}

export interface IBlacklistDAO {
  getAllBlacklistItems(): string[]
  inBlacklist(namespace: string): boolean
  addBlacklistItem(namespace: string): void
  removeBlacklistItem(namespace: string): void
}

export interface IWhitelistDAO {
  getAllWhitelistItems(): string[]
  inWhitelist(namespace: string): boolean
  addWhitelistItem(namespace: string): void
  removeWhitelistItem(namespace: string): void
}

export interface ITokenDAO {
  getAllNamespacesWithTokens(): string[]
  getAllTokens(namespace: string): ITokenInfo[]

  hasProduceTokens(namespace: string): boolean
  matchProduceToken(params: {
    token: string
    namespace: string
  }): boolean
  setProduceToken(params: {
    token: string
    namespace: string
  }): void
  unsetProduceToken(params: {
    token: string
    namespace: string
  }): void

  hasConsumeTokens(namespace: string): boolean
  matchConsumeToken(params: {
    token: string
    namespace: string
  }): boolean
  setConsumeToken(params: {
    token: string
    namespace: string
  }): void
  unsetConsumeToken(params: {
    token: string
    namespace: string
  }): void

  matchClearToken(params: {
    token: string
    namespace: string
  }): boolean
  setClearToken(params: {
    token: string
    namespace: string
  }): void
  unsetClearToken(params: {
    token: string
    namespace: string
  }): void
}

export interface ITokenPolicyDAO {
  getAllNamespacesWithTokenPolicies(): string[]
  getTokenPolicies(namespace: string): ITokenPolicy

  setProduceTokenRequired(namespace: string, val: boolean): void
  unsetProduceTokenRequired(namespace: string): void

  setConsumeTokenRequired(namespace: string, val: boolean): void
  unsetConsumeTokenRequired(namespace: string): void

  setClearTokenRequired(namespace: string, val: boolean): void
  unsetClearTokenRequired(namespace: string): void
}
