import { MQDAO } from '@dao/index.js'

export function prepareFailedMessage(
  namespace: string
, id: string
, type: string
, payload: string
): void {
  MQDAO.draftMessage(namespace, id)
  MQDAO.setMessage(namespace, id, type, payload)
  MQDAO.orderMessage(namespace, Infinity)
  MQDAO.getMessage(namespace, id)
  MQDAO.failMessage(namespace, id)
}
