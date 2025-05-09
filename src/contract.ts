import { CustomError } from '@blackglory/errors'

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
  MQ: {
    draft(namespace: string, priority: number | null): string

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
    ): null

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
    abandon(namespace: string, messageId: string): null

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    complete(namespace: string, messageId: string): null

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    fail(namespace: string, messageId: string): null

    /**
     * @throws {NotFound}
     * @throws {BadMessageState}
     */
    renew(namespace: string, messageId: string): null

    abandonAllFailedMessages(namespace: string): null
    renewAllFailedMessages(namespace: string): null

    getAllFailedMessageIds(namespace: string): string[]
    getAllNamespaces(): string[]

    clear(namespace: string): null
    stats(namespace: string): IStats
  }

  Configuration: {
    getAllNamespaces(): string[]
    get(namespace: string): IConfiguration

    setUnique(namespace: string, val: boolean): null
    unsetUnique(namespace: string): null

    setDraftingTimeout(namespace: string, val: number): null
    unsetDraftingTimeout(namespace: string): null

    setOrderedTimeout(namespace: string, val: number): null
    unsetOrderedTimeout(namespace: string): null

    setActiveTimeout(namespace: string, val: number): null
    unsetActiveTimeout(namespace: string): null

    setConcurrency(namespace: string, val: number): null
    unsetConcurrency(namespace: string): null
  }
}

export class NotFound extends CustomError {}
export class BadMessageState extends CustomError {
  constructor(...requiredStates: [string, ...string[]]) {
    if (requiredStates.length === 1) {
      super(`The state of message must be "${requiredStates[0]}"`)
    } else {
      const text = requiredStates
                     .map(x => `"${x}"`)
                     .join(', ')
      super(`The state of message must be one of ${text}`)
    }
  }
}
export class DuplicatePayload extends CustomError {}
