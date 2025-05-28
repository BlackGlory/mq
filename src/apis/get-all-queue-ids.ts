import { getAllQueueIds as _getAllQueueIds } from '@dao/get-all-queue-ids.js'

export function getAllQueueIds(): string[] {
  return _getAllQueueIds()
}
