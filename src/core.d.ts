type Json = import('justypes').Json
type CustomErrorConstructor = import('@blackglory/errors').CustomErrorConstructor
type CustomError = import('@blackglory/errors').CustomError

interface IMessage {
  type: string
  payload: string
  priority: number | null
}

interface IStats {
  namespace: string
  drafting: number
  waiting: number
  ordered: number
  active: number
  completed: number
  failed: number
}

interface IThrottle {
  cycleStartTime: number
  count: number
}

interface ICore {
  isAdmin(password: string): boolean

  MQ: {
    PendingOrderControllerRegistry: {
      register(namespace: string, controller: AbortController): void
      unregister(namespace: string, controller: AbortController): void
      abortAll(namespace: string): void
    }

    draft(namespace: string, priority?: number): Promise<string>

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     * @throws {DuplicatePayload}
     */
    set(
      namespace: string
    , messageId: string
    , type: string
    , payload: string
    ): Promise<void>

    /**
     * @throws {AbortError}
     */
    order(namespace: string, abortSignal: AbortSignal): Promise<string>

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    get(namespace: string, messageId: string): Promise<IMessage>

    /**
     * @throws {NotFound}
     */
    abandon(namespace: string, messageId: string): Promise<void>

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    complete(namespace: string, messageId: string): Promise<void>

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    fail(namespace: string, messageId: string): Promise<void>

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    renew(namespace: string, messageId: string): Promise<void>

    abandonAllFailedMessages(namespace: string): Promise<void>
    renewAllFailedMessages(namespace: string): Promise<void>

    getAllFailedMessageIds(namespace: string): AsyncIterable<string>
    getAllNamespaces(): AsyncIterable<string>
    nextTick(): Promise<void>

    clear(namespace: string): Promise<void>
    stats(namespace: string): Promise<IStats>

    NotFound: CustomErrorConstructor
    BadMessageState: CustomErrorConstructor
    DuplicatePayload: CustomErrorConstructor
    AbortError: CustomErrorConstructor
  }

  Configuration: {
    getAllNamespaces(): Promise<string[]>
    get(namespace: string): Promise<IConfiguration>

    setUnique(namespace: string, val: boolean): Promise<void>
    unsetUnique(namespace: string): Promise<void>

    setDraftingTimeout(namespace: string, val: number): Promise<void>
    unsetDraftingTimeout(namespace: string): Promise<void>

    setOrderedTimeout(namespace: string, val: number): Promise<void>
    unsetOrderedTimeout(namespace: string): Promise<void>

    setActiveTimeout(namespace: string, val: number): Promise<void>
    unsetActiveTimeout(namespace: string): Promise<void>

    setConcurrency(namespace: string, val: number): Promise<void>
    unsetConcurrency(namespace: string): Promise<void>

    setThrottle(namespace: string, val: Throttle): Promise<void>
    unsetThrottle(namespace: string): Promise<void>
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(namespace: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(namespace: string): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): Promise<void>
    Forbidden: CustomErrorConstructor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(namespace: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(namespace: string): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): Promise<void>
    Forbidden: CustomErrorConstructor
  }

  JsonSchema: {
    isEnabled(): boolean
    getAllNamespaces(): Promise<string[]>
    get(namespace: string): Promise<string | null>
    set(namespace: string, schema: Json): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {InvalidPayload}
     */
    validate(namespace: string, payload: string): Promise<void>
    InvalidPayload: CustomErrorConstructor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkProducePermission(namespace: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkConsumePermission(namespace: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkClearPermission(namespace: string, token?: string): Promise<void>

    Unauthorized: CustomErrorConstructor

    Token: {
      getAllNamespaces(): Promise<string[]>
      getAll(namespace: string): Promise<Array<ITokenInfo>>

      setProduceToken(namespace: string, token: string): Promise<void>
      unsetProduceToken(namespace: string, token: string): Promise<void>

      setConsumeToken(namespace: string, token: string): Promise<void>
      unsetConsumeToken(namespace: string, token: string): Promise<void>

      setClearToken(namespace: string, token: string): Promise<void>
      unsetClearToken(namespace: string, token: string): Promise<void>
    }

    TokenPolicy: {
      getAllNamespaces(): Promise<string[]>
      get(namespace: string): Promise<ITokenPolicy>

      setProduceTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetProduceTokenRequired(namespace: string): Promise<void>

      setConsumeTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetConsumeTokenRequired(namespace: string): Promise<void>

      setClearTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetClearTokenRequired(namespace: string): Promise<void>
    }
  }
}
