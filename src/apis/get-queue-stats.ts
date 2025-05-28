import { IQueueStats } from '@src/contract.js'
import { getQueueStats as _getQueueStats } from '@dao/get-queue-stats.js'

export function getQueueStats(queueId: string): IQueueStats | null {
  return _getQueueStats(queueId)
}
