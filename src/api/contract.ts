import { CustomErrorConstructor } from '@blackglory/errors'

export interface ITokenInfo {
  token: string
  produce: boolean
  consume: boolean
  clear: boolean
}

export interface ITokenPolicy {
  produceTokenRequired: boolean | null
  consumeTokenRequired: boolean | null
  clearTokenRequired: boolean | null
}

export interface IConfiguration {
  unique: boolean | null
  draftingTimeout: number | null
  orderedTimeout: number | null
  activeTimeout: number | null
  concurrency: number | null
}

export interface IMessage {
  type: string
  payload: string
  priority: number | null
}

export interface IStats {
  namespace: string
  drafting: number
  waiting: number
  ordered: number
  active: number
  completed: number
  failed: number
}

export interface IAPI {
  isAdmin(password: string): boolean

  MQ: {
    PendingOrderControllerRegistry: {
      register(namespace: string, controller: AbortController): void
      unregister(namespace: string, controller: AbortController): void
      abortAll(namespace: string): void
    }

    draft(namespace: string, priority?: number): string

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
    ): void

    /**
     * @throws {AbortError}
     */
    order(namespace: string, abortSignal: AbortSignal): Promise<string>

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    get(namespace: string, messageId: string): IMessage

    /**
     * @throws {NotFound}
     */
    abandon(namespace: string, messageId: string): void

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    complete(namespace: string, messageId: string): void

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    fail(namespace: string, messageId: string): void

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    renew(namespace: string, messageId: string): void

    abandonAllFailedMessages(namespace: string): void
    renewAllFailedMessages(namespace: string): void

    getAllFailedMessageIds(namespace: string): Iterable<string>
    getAllNamespaces(): Iterable<string>
    nextTick(): void

    clear(namespace: string): void
    stats(namespace: string): IStats

    NotFound: CustomErrorConstructor
    BadMessageState: CustomErrorConstructor
    DuplicatePayload: CustomErrorConstructor
    AbortError: CustomErrorConstructor
  }

  Configuration: {
    getAllNamespaces(): string[]
    get(namespace: string): IConfiguration

    setUnique(namespace: string, val: boolean): void
    unsetUnique(namespace: string): void

    setDraftingTimeout(namespace: string, val: number): void
    unsetDraftingTimeout(namespace: string): void

    setOrderedTimeout(namespace: string, val: number): void
    unsetOrderedTimeout(namespace: string): void

    setActiveTimeout(namespace: string, val: number): void
    unsetActiveTimeout(namespace: string): void

    setConcurrency(namespace: string, val: number): void
    unsetConcurrency(namespace: string): void
  }
}
