import { MQDAO } from '@dao'

export async function prepareFailedMessages(namespace: string, ids: string[]) {
  for (const id of ids) {
    await MQDAO.draftMessage(namespace, id)
    await MQDAO.setMessage(namespace, id, 'type', 'payload')
    await MQDAO.orderMessage(namespace, Infinity, Infinity, Infinity)
    await MQDAO.getMessage(namespace, id)
    await MQDAO.failMessage(namespace, id)
  }
}
