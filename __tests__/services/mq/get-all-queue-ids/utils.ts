import { MQDAO } from '@dao'

export async function prepareQueues(queueIds: string[]) {
  for (const queueId of queueIds) {
    await MQDAO.draftMessage(queueId, 'message-id')
  }
}
