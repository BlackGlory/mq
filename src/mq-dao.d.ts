interface IMQDAO {
  draftMessage(queueId: string, messageId: string, priority?: number): Promise<void>

  /**
   * @throws {BadMessageState}
   */
  setMessage(queueId: string, messageId: string, type: string, payload: string, unique?: boolean): Promise<void>
  orderMessage(queueId: string, concurrency: number, duration: number, limit: number): Promise<string | null>

  /**
   * @throws {NotFound}
   * @throws {BadMessageState}
   */
  getMessage(queueId: string, messageId: string): Promise<IMessage>

  /**
   * @throws {BadMessageState}
   */
  completeMessage(queueId: string, messageId: string): Promise<void>

  /**
   * @throws {BadMessageState}
   */
  abandonMessage(queueId: string, messageId: string): Promise<void>

  stats(queueId: string): Promise<IStats>
  clear(queueId: string): Promise<void>

  clearOutdatedDraftingMessages(queueId: string, timestamp: number): Promise<void>
  clearOutdatedOrderedMessages(queueId: string, timestamp: number): Promise<void>
  clearOutdatedActiveMessages(queueId: string, timestamp: number): Promise<void>

  NotFound: CustomErrorConstructor
  BadMessageState: new (...states: [string, ...string[]]) => CustomError
}
