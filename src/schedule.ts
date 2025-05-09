import { nextTick } from '@apis/mq.js'
import { AbortError } from 'extra-abort'
import { setDynamicTimeoutLoop } from 'extra-timers'
import ms from 'ms'

/**
 * 该函数是一个长时函数, 每个异步操作都应该可以响应AbortSignal以提前返回.
 */
export function callNextTickEverySecond(signal: AbortSignal): void {
  const cancel = setDynamicTimeoutLoop(ms('1s'), async () => {
    try {
      nextTick()
    } catch (e) {
      if (e instanceof AbortError) return cancel()
      console.error(e)
    }
  })
}
