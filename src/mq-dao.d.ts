interface IMQDAO {
  draftMessage(queueId: string, messageId: string, priority?: number): Promise<void>
  setMessage(queueId: string, messageId: string, type: string, payload: string): Promise<void>
  orderMessage(queueId: string, duration: number, limit: number): Promise<string | null>
  getMessage(queueId: string, messageId: string): Promise<IMessage>
  completeMessage(queueId: string, messageId: string): Promise<void>
  abandonMessage(queueId: string, messageId: string): Promise<void>

  stats(queueId: string): Promise<IStats>
  clear(queueId: string): Promise<void>

  clearOutdatedDraftingMessages(queueId: string, timestamp: number): Promise<void>
  clearOutdatedOrderedMessages(queueId: string, timestamp: number): Promise<void>
  clearOutdatedActiveMessages(queueId: string, timestamp: number): Promise<void>
}
