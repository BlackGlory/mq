import { MQDAO } from '@dao/index.js'

export function prepareWaitingMessage(
  namespace: string
, id: string
, type: string
, payload: string
): void {
  MQDAO.draftMessage(namespace, id)
  MQDAO.setMessage(namespace, id, type, payload)
}
