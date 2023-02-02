import { MQDAO } from '@dao/index.js'

export function prepareNamespaces(namespaces: string[]): void {
  for (const namespace of namespaces) {
    MQDAO.draftMessage(namespace, 'message-id')
  }
}
