import { MQDAO } from '@dao/index.js'

export async function prepareFailedMessages(namespace: string, ids: string[]) {
  for (const id of ids) {
    await MQDAO.draftMessage(namespace, id)
    await MQDAO.setMessage(namespace, id, 'type', 'payload')
    await MQDAO.orderMessage(namespace, Infinity)
    await MQDAO.getMessage(namespace, id)
    await MQDAO.failMessage(namespace, id)
  }
}
