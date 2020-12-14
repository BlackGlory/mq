interface IMessage {
  type: string
  payload: string
}

interface IStats {
  drafting: number
  waiting: number
  ordered: number
  active: number
  completed: number
}
interface ICore {
  isAdmin(password: string): boolean

  stats(): {
    memoryUsage: NodeJS.MemoryUsage
    cpuUsage: NodeJS.CpuUsage
    resourceUsage: NodeJS.ResourceUsage
  }

  MQ: {
    draft(queueId: string, priority?: number): Promise<string>
    set(queueId: string, messageId: string, type: string, payload: string): Promise<void>
    order(queueId: string): Promise<string>
    get(queueId: string, messageId: string): Promise<IMessage>
    complete(queueId: string, messageId: string): Promise<void>
    abandon(queueId: string, messageId: string): Promise<void>

    clear(queueId: string): Promise<void>
    stats(id: string): Promise<IStats>
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
    check(id: string): Promise<void>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    check(id: string): Promise<void>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>
  }

  JsonSchema: {
    isEnabled(): boolean
    validate(id: string, payload: unknown): Promise<void>
    getAllIds(): Promise<string[]>
    get(id: string): Promise<string | null>
    set(id: string, schema: import('@blackglory/types').Json): Promise<void>
    remove(id: string): Promise<void>
  }

  TBAC: {
    isEnabled(): boolean
    checkProducePermission(id: string, token?: string): Promise<void>
    checkConsumePermission(id: string, token?: string): Promise<void>
    checkClearPermission(id: string, token?: string): Promise<void>

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

  Error: {
    Forbidden: new () => Error
    Unauthorized: new () => Error
    NotFound: new () => Error
    IncorrectRevision: new () => Error
  }
}
