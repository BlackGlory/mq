import { MQDAO } from '@dao/index.js'

export async function prepareWaitingMessage(
  namespace: string
, id: string
, type: string
, payload: string
) {
  await MQDAO.draftMessage(namespace, id)
  await MQDAO.setMessage(namespace, id, type, payload)
}
