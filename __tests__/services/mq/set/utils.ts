import { MQDAO } from '@dao'

export async function prepareDraftingMessage(queueId: string, messageId: string) {
  await MQDAO.draftMessage(queueId, messageId)
}
