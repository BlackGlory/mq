import { MQDAO } from '@dao'

export async function prepareOrderedMessage(
  namespace: string
, id: string
, type: string
, payload: string
, priority?: number
) {
  await MQDAO.draftMessage(namespace, id, priority)
  await MQDAO.setMessage(namespace, id, type, payload)
  await MQDAO.orderMessage(namespace, Infinity)
}
