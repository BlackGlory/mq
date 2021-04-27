import { MQDAO } from '@dao'

export async function prepareOrderedMessage(namespace: string, id: string, type: string, payload: string) {
  await MQDAO.draftMessage(namespace, id)
  await MQDAO.setMessage(namespace, id, type, payload)
  await MQDAO.orderMessage(namespace, Infinity, Infinity, Infinity)
}
