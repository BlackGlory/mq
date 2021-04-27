interface ITokenInfo {
  token: string
  produce: boolean
  consume: boolean
  clear: boolean
}

interface ITokenPolicy {
  produceTokenRequired: boolean | null
  consumeTokenRequired: boolean | null
  clearTokenRequired: boolean | null
}

interface IBlacklistDAO {
  getAllBlacklistItems(): Promise<string[]>
  inBlacklist(namespace: string): Promise<boolean>
  addBlacklistItem(namespace: string): Promise<void>
  removeBlacklistItem(namespace: string): Promise<void>
}

interface IWhitelistDAO {
  getAllWhitelistItems(): Promise<string[]>
  inWhitelist(namespace: string): Promise<boolean>
  addWhitelistItem(namespace: string): Promise<void>
  removeWhitelistItem(namespace: string): Promise<void>
}

interface ITokenDAO {
  getAllNamespacesWithTokens(): Promise<string[]>
  getAllTokens(namespace: string): Promise<Array<ITokenInfo>>

  hasProduceTokens(namespace: string): Promise<boolean>
  matchProduceToken(params: { token: string; namespace: string }): Promise<boolean>
  setProduceToken(params: { token: string; namespace: string }): Promise<void>
  unsetProduceToken(params: { token: string; namespace: string }): Promise<void>

  hasConsumeTokens(namespace: string): Promise<boolean>
  matchConsumeToken(params: { token: string; namespace: string }): Promise<boolean>
  setConsumeToken(params: { token: string; namespace: string }): Promise<void>
  unsetConsumeToken(params: { token: string; namespace: string }): Promise<void>

  matchClearToken(params: { token: string; namespace: string }): Promise<boolean>
  setClearToken(params: { token: string; namespace: string }): Promise<void>
  unsetClearToken(params: { token: string; namespace: string }): Promise<void>
}

interface ITokenPolicyDAO {
  getAllNamespacesWithTokenPolicies(): Promise<string[]>
  getTokenPolicies(namespace: string): Promise<ITokenPolicy>

  setProduceTokenRequired(namespace: string, val: boolean): Promise<void>
  unsetProduceTokenRequired(namespace: string): Promise<void>

  setConsumeTokenRequired(namespace: string, val: boolean): Promise<void>
  unsetConsumeTokenRequired(namespace: string): Promise<void>

  setClearTokenRequired(namespace: string, val: boolean): Promise<void>
  unsetClearTokenRequired(namespace: string): Promise<void>
}

interface IAccessControlDAO extends
  IBlacklistDAO
, IWhitelistDAO
, ITokenDAO
, ITokenPolicyDAO {}
