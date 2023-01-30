import { MQDAO } from '@dao/index.js'

export async function prepareDraftingMessage(namespace: string, id: string) {
  await MQDAO.draftMessage(namespace, id)
}
