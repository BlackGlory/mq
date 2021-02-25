import { maintainAllQueues } from '@core/mq'
import { delay } from 'extra-promise'
import ms = require('ms')

export async function maintainQueuesEverySecond(abortSignal: AbortSignal): Promise<void> {
  while (!abortSignal.aborted) {
    await maintainAllQueues()
    await delay(ms('1s'))
  }
}
