import { MQDAO } from '@dao'

export async function prepareDraftingMessage(queueId: string, messageId: string) {
  await MQDAO.draftMessage(queueId, messageId)
}

export function createJsonHeaders() {
  return {
    'Content-Type': 'application/json'
  }
}
