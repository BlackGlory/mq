import { IQueueConfig } from '@src/contract.js'
import { getQueueConfiguration } from '@dao/get-queue-configuration.js'

export function getQueue(queueId: string): IQueueConfig | null {
  return getQueueConfiguration(queueId)
}
