import { MQDAO } from '@dao'

export async function prepareDraftingMessage(namespace: string, id: string) {
  await MQDAO.draftMessage(namespace, id)
}
