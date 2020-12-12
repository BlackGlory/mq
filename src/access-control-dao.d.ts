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
  inBlacklist(id: string): Promise<boolean>
  addBlacklistItem(id: string): Promise<void>
  removeBlacklistItem(id: string): Promise<void>
}

interface IWhitelistDAO {
  getAllWhitelistItems(): Promise<string[]>
  inWhitelist(id: string): Promise<boolean>
  addWhitelistItem(id: string): Promise<void>
  removeWhitelistItem(id: string): Promise<void>
}

interface ITokenDAO {
  getAllIdsWithTokens(): Promise<string[]>
  getAllTokens(id: string): Promise<Array<ITokenInfo>>

  hasProduceTokens(id: string): Promise<boolean>
  matchProduceToken(props: { token: string; id: string }): Promise<boolean>
  setProduceToken(props: { token: string; id: string }): Promise<void>
  unsetProduceToken(props: { token: string; id: string }): Promise<void>

  hasConsumeTokens(id: string): Promise<boolean>
  matchConsumeToken(props: { token: string; id: string }): Promise<boolean>
  setConsumeToken(props: { token: string; id: string }): Promise<void>
  unsetConsumeToken(props: { token: string; id: string }): Promise<void>

  matchClearToken(props: { token: string; id: string }): Promise<boolean>
  setClearToken(props: { token: string; id: string }): Promise<void>
  unsetClearToken(props: { token: string; id: string }): Promise<void>
}

interface ITokenPolicyDAO {
  getAllIdsWithTokenPolicies(): Promise<string[]>
  getTokenPolicies(id: string): Promise<ITokenPolicy>

  setProduceTokenRequired(id: string, val: boolean): Promise<void>
  unsetProduceTokenRequired(id: string): Promise<void>

  setConsumeTokenRequired(id: string, val: boolean): Promise<void>
  unsetConsumeTokenRequired(id: string): Promise<void>

  setClearTokenRequired(id: string, val: boolean): Promise<void>
  unsetClearTokenRequired(id: string): Promise<void>
}

interface IAccessControlDAO extends
  IBlacklistDAO
, IWhitelistDAO
, ITokenDAO
, ITokenPolicyDAO {}
