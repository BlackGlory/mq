import { CustomError, CustomErrorConstructor } from '@blackglory/errors'
import { IMessage, IStats } from '@api/contract.js'
export { IMessage, IStats } from '@api/contract.js'

export interface IMQDAO {
  draftMessage(namespace: string, messageId: string, priority?: number): void

  /**
   * @throws {NotFound}
   * @throws {BadMessageState}
   * @throws {DuplicatePayload}
   */
  setMessage(
    namespace: string
  , messageId: string
  , type: string
  , payload: string
  , unique?: boolean
  ): void

  orderMessage(
    namespace: string
  , concurrency: number
  ): string | null

  /**
   * @throws {NotFound}
   * @throws {BadMessageState}
   */
  getMessage(namespace: string, messageId: string): IMessage

  /**
   * @throws {NotFound}
   */
  abandonMessage(namespace: string, messageId: string): void

  /**
   * @throws {NotFound}
   * @throws {BadMessageState}
   */
  completeMessage(namespace: string, messageId: string): void

  /**
   * @throws {NotFound}
   * @throws {BadMessageState}
   */
  failMessage(namespace: string, messageId: string): void

  /**
   * @throws {NotFound}
   * @throws {BadMessageState}
   */
  renewMessage(namespace: string, messageId: string): void

  abandonAllFailedMessages(namespace: string): void
  renewAllFailedMessages(namespace: string): void

  stats(namespace: string): IStats
  clear(namespace: string): void

  getAllFailedMessageIds(namespace: string): Iterable<string>
  getAllWorkingNamespaces(): Iterable<string>
  getAllNamespaces(): Iterable<string>

  rollbackOutdatedDraftingMessages(
    namespace: string
  , timestamp: number
  ): boolean
  rollbackOutdatedOrderedMessages(
    namespace: string
  , timestamp: number
  ): boolean
  rollbackOutdatedActiveMessages(namespace: string, timestamp: number): boolean

  NotFound: CustomErrorConstructor
  DuplicatePayload: CustomErrorConstructor
  BadMessageState: new (...states: [string, ...string[]]) => CustomError
}
