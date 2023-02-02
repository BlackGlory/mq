import { MQDAO } from '@dao/index.js'

export function prepareDraftingMessage(namespace: string, id: string): void {
  MQDAO.draftMessage(namespace, id)
}
