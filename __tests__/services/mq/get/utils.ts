import { MQDAO } from '@dao/index.js'

export function prepareOrderedMessage(
  namespace: string
, id: string
, type: string
, payload: string
, priority?: number
): void {
  MQDAO.draftMessage(namespace, id, priority)
  MQDAO.setMessage(namespace, id, type, payload)
  MQDAO.orderMessage(namespace, Infinity)
}
