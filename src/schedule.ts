import { nextTick } from '@core/mq'
import { AbortError, withAbortSignal } from 'extra-promise'
import { setDynamicTimeoutLoop } from 'extra-timers'
import ms from 'ms'

/**
 * 该函数是一个长时函数, 每个异步操作都应该可以响应AbortSignal以提前返回.
 */
export function callNextTickEverySecond(abortSignal: AbortSignal): void {
  const cancel = setDynamicTimeoutLoop(ms('1s'), async () => {
    try {
      await withAbortSignal(abortSignal, nextTick)
    } catch (e) {
      if (e instanceof AbortError) return cancel()
      console.error(e)
    }
  })
}
