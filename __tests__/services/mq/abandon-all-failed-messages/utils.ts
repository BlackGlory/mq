import { MQDAO } from '@dao'

export async function prepareFailedMessage(queueId: string, messageId: string, type: string, payload: string) {
  await MQDAO.draftMessage(queueId, messageId)
  await MQDAO.setMessage(queueId, messageId, type, payload)
  await MQDAO.orderMessage(queueId, Infinity, Infinity, Infinity)
  await MQDAO.getMessage(queueId, messageId)
  await MQDAO.failMessage(queueId, messageId)
}
