import { MQDAO } from '@dao'

export async function prepareActiveMessage(queueId: string, messageId: string, type: string, payload: string) {
  await MQDAO.draftMessage(queueId, messageId)
  await MQDAO.setMessage(queueId, messageId, type, payload)
  await MQDAO.orderMessage(queueId, Infinity, Infinity)
  await MQDAO.getMessage(queueId, messageId)
}
