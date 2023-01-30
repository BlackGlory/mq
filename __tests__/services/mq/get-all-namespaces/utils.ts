import { MQDAO } from '@dao/index.js'

export async function prepareNamespaces(namespaces: string[]) {
  for (const namespace of namespaces) {
    await MQDAO.draftMessage(namespace, 'message-id')
  }
}
