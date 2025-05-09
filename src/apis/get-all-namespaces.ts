import { toArray } from '@blackglory/prelude'
import { getAllNamespaces as _getAllNamespaces } from '@dao/get-all-namespaces.js'

export function getAllNamespaces(): string[] {
  return toArray(_getAllNamespaces())
}
