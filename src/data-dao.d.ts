interface IDataDAO {
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

  getAllWorkingQueueIds(): Promise<string[]>
  listAllQueueIds(): Promise<string[]>
  fallbackOutdatedDraftingMessages(queueId: string, timestamp: number): Promise<void>
  fallbackOutdatedOrderedMessages(queueId: string, timestamp: number): Promise<void>
  fallbackOutdatedActiveMessages(queueId: string, timestamp: number): Promise<void>

  NotFound: CustomErrorConstructor
  BadMessageState: new (...states: [string, ...string[]]) => CustomError
}
