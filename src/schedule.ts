import { maintainAllQueues } from '@core/mq'
import { delay, AbortError, withAbortSignal } from 'extra-promise'
import ms = require('ms')

/**
 * 该函数是一个长时函数, 每个异步操作都应该可以响应AbortSignal以提前返回.
 */
export async function maintainQueuesEverySecond(abortSignal: AbortSignal): Promise<void> {
  while (true) {
    try {
      await withAbortSignal(abortSignal, maintainAllQueues)
      await withAbortSignal(abortSignal, () => delay(ms('1s')))
    } catch (e) {
      if (e instanceof AbortError) break
      throw e
    }
  }
}
