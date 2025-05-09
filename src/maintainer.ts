import { nextTick } from '@apis/mq.js'
import { setDynamicTimeoutLoop } from 'extra-timers'
import ms from 'ms'

export function startMaintainer(): () => void {
  const stopTickLoop = setDynamicTimeoutLoop(ms('1s'), nextTick)

  return () => stopTickLoop()
}
