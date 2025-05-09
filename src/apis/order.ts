import { getConfiguration } from '@dao/configuration.js'
import { PendingOrderControllerRegistry } from './pending-order-controller-registry.js'
import { orderMessage } from '@dao/order-message.js'
import { firstValueFrom, fromEvent, race } from 'rxjs'
import * as SignalDAO from '@dao/signal.js'
import { AbortError } from 'extra-abort'

export async function order(namespace: string, signal?: AbortSignal): Promise<string> {
  const controller = new AbortController()

  signal?.addEventListener('abort', () => {
    controller.abort()
    PendingOrderControllerRegistry.unregister(namespace, controller)
  })

  try {
    PendingOrderControllerRegistry.register(namespace, controller)
    const result = await _order(namespace, controller.signal)
    return result
  } finally {
    PendingOrderControllerRegistry.unregister(namespace, controller)
  }
}

/**
 * @throws {AbortError}
 */
async function _order(
  namespace: string
, abortSignal: AbortSignal
): Promise<string> {
  while (!abortSignal.aborted) {
    const configurations = getConfiguration(namespace)
    const concurrency = configurations.concurrency ?? Infinity

    const id = orderMessage(namespace, concurrency)
    if (id) return id

    await firstValueFrom(
      // 其中一个Observable返回值时, 另一个Observable会被退订
      race(
        SignalDAO.observe(namespace) // 如果信号先返回, 则进入下一轮循环
      , fromEvent(abortSignal, 'abort') // 如果中断信号先返回, 则中断循环
      )
    )
  }

  throw new AbortError()
}
