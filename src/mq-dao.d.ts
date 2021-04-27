interface IMQDAO {
  draftMessage(namespace: string, messageId: string, priority?: number): Promise<void>

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
  ): Promise<void>

  orderMessage(
    namespace: string
  , concurrency: number
  , duration: number
  , limit: number
  ): Promise<string | null>

  /**
   * @throws {NotFound}
   * @throws {BadMessageState}
   */
  getMessage(namespace: string, messageId: string): Promise<IMessage>

  /**
   * @throws {NotFound}
   */
  abandonMessage(namespace: string, messageId: string): Promise<void>

  /**
   * @throws {NotFound}
   * @throws {BadMessageState}
   */
  completeMessage(namespace: string, messageId: string): Promise<void>

  /**
   * @throws {NotFound}
   * @throws {BadMessageState}
   */
  failMessage(namespace: string, messageId: string): Promise<void>

  /**
   * @throws {NotFound}
   * @throws {BadMessageState}
   */
  renewMessage(namespace: string, messageId: string): Promise<void>

  abandonAllFailedMessages(namespace: string): Promise<void>
  renewAllFailedMessages(namespace: string): Promise<void>

  stats(namespace: string): Promise<IStats>
  clear(namespace: string): Promise<void>

  getAllFailedMessageIds(namespace: string): AsyncIterable<string>
  getAllWorkingNamespaces(): AsyncIterable<string>
  getAllNamespaces(): AsyncIterable<string>

  rollbackOutdatedDraftingMessages(
    namespace: string
  , timestamp: number
  ): Promise<boolean>
  rollbackOutdatedOrderedMessages(
    namespace: string
  , timestamp: number
  ): Promise<boolean>
  rollbackOutdatedActiveMessages(namespace: string, timestamp: number): Promise<boolean>

  NotFound: CustomErrorConstructor
  DuplicatePayload: CustomErrorConstructor
  BadMessageState: new (...states: [string, ...string[]]) => CustomError
}
