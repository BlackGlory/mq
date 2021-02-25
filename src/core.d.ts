type Json = import('@blackglory/types').Json
type CustomErrorConstructor = import('@blackglory/errors').CustomErrorConstructor
type CustomError = import('@blackglory/errors').CustomError

interface IMessage {
  type: string
  payload: string
  priority: number
}

interface IStats {
  id: string
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

  metrics(): {
    memoryUsage: NodeJS.MemoryUsage
    cpuUsage: NodeJS.CpuUsage
    resourceUsage: NodeJS.ResourceUsage
  }

  MQ: {
    draft(queueId: string, priority?: number): Promise<string>

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     * @throws {DuplicatePayload}
     */
    set(queueId: string, messageId: string, type: string, payload: string): Promise<void>

    order(queueId: string): Promise<string>

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    get(queueId: string, messageId: string): Promise<IMessage>

    /**
     * @throws {NotFound}
     */
    abandon(queueId: string, messageId: string): Promise<void>

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    complete(queueId: string, messageId: string): Promise<void>

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    fail(queueId: string, messageId: string): Promise<void>

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    renew(queueId: string, messageId: string): Promise<void>

    abandonAllFailedMessages(queueId: string): Promise<void>
    renewAllFailedMessages(queueId: string): Promise<void>

    getAllFailedMessageIds(queueId: string): AsyncIterable<string>
    getAllQueueIds(): AsyncIterable<string>
    maintainAllQueues(): Promise<void>

    clear(queueId: string): Promise<void>
    stats(queueId: string): Promise<IStats>

    NotFound: CustomErrorConstructor
    BadMessageState: CustomErrorConstructor
    DuplicatePayload: CustomErrorConstructor
  }

  Configuration: {
    getAllIds(): Promise<string[]>
    get(id: string): Promise<Configurations>

    setUnique(queueId: string, val: boolean): Promise<void>
    unsetUnique(queueId: string): Promise<void>

    setDraftingTimeout(queueId: string, val: number): Promise<void>
    unsetDraftingTimeout(queueId: string): Promise<void>

    setOrderedTimeout(queueId: string, val: number): Promise<void>
    unsetOrderedTimeout(queueId: string): Promise<void>

    setActiveTimeout(queueId: string, val: number): Promise<void>
    unsetActiveTimeout(queueId: string): Promise<void>

    setConcurrency(queueId: string, val: number): Promise<void>
    unsetConcurrency(queueId: string): Promise<void>

    setThrottle(queueId: string, val: Throttle): Promise<void>
    unsetThrottle(queueId: string): Promise<void>
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(id: string): Promise<void>
    Forbidden: CustomErrorConstructor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(id: string): Promise<void>
    Forbidden: CustomErrorConstructor
  }

  JsonSchema: {
    isEnabled(): boolean
    getAllIds(): Promise<string[]>
    get(id: string): Promise<string | null>
    set(id: string, schema: import('@blackglory/types').Json): Promise<void>
    remove(id: string): Promise<void>

    /**
     * @throws {InvalidPayload}
     */
    validate(id: string, payload: string): Promise<void>
    InvalidPayload: CustomErrorConstructor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkProducePermission(id: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkConsumePermission(id: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkClearPermission(id: string, token?: string): Promise<void>

    Unauthorized: CustomErrorConstructor

    Token: {
      getAllIds(): Promise<string[]>
      getAll(id: string): Promise<Array<ITokenInfo>>

      setProduceToken(id: string, token: string): Promise<void>
      unsetProduceToken(id: string, token: string): Promise<void>

      setConsumeToken(id: string, token: string): Promise<void>
      unsetConsumeToken(id: string, token: string): Promise<void>

      setClearToken(id: string, token: string): Promise<void>
      unsetClearToken(id: string, token: string): Promise<void>
    }

    TokenPolicy: {
      getAllIds(): Promise<string[]>
      get(id: string): Promise<ITokenPolicy>

      setProduceTokenRequired(id: string, val: boolean): Promise<void>
      unsetProduceTokenRequired(id: string): Promise<void>

      setConsumeTokenRequired(id: string, val: boolean): Promise<void>
      unsetConsumeTokenRequired(id: string): Promise<void>

      setClearTokenRequired(id: string, val: boolean): Promise<void>
      unsetClearTokenRequired(id: string): Promise<void>
    }
  }
}
