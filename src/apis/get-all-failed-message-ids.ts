import { toArray } from '@blackglory/prelude'
import { getAllFailedMessageIds as _getAllFailedMessageIds } from '@dao/get-all-failed-message-ids.js'

export function getAllFailedMessageIds(namespace: string): string[] {
  return toArray(_getAllFailedMessageIds(namespace))
}
