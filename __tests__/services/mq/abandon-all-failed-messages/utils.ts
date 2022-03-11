import { MQDAO } from '@dao'

export async function prepareFailedMessage(namespace: string, id: string, type: string, payload: string) {
  await MQDAO.draftMessage(namespace, id)
  await MQDAO.setMessage(namespace, id, type, payload)
  await MQDAO.orderMessage(namespace, Infinity)
  await MQDAO.getMessage(namespace, id)
  await MQDAO.failMessage(namespace, id)
}
