import { MQDAO } from '@dao'

export async function prepareNamespaces(namespaces: string[]) {
  for (const namespace of namespaces) {
    await MQDAO.draftMessage(namespace, 'message-id')
  }
}
