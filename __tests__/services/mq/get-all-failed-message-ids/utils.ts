import { MQDAO } from '@dao/index.js'

export function prepareFailedMessages(namespace: string, ids: string[]): void {
  for (const id of ids) {
    MQDAO.draftMessage(namespace, id)
    MQDAO.setMessage(namespace, id, 'type', 'payload')
    MQDAO.orderMessage(namespace, Infinity)
    MQDAO.getMessage(namespace, id)
    MQDAO.failMessage(namespace, id)
  }
}
