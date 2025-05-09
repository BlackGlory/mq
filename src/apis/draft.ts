import { draftMessage } from '@dao/draft-message.js'
import { nanoid } from 'nanoid'

export function draft(namespace: string, priority: number | null): string {
  const messageId = nanoid()
  draftMessage(namespace, messageId, priority ?? undefined)
  return messageId
}
