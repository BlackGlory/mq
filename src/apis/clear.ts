import { clear as _clear } from '@dao/clear.js'
import { PendingOrderControllerRegistry } from './pending-order-controller-registry.js'

export function clear(namespace: string): null {
  _clear(namespace)
  PendingOrderControllerRegistry.abortAll(namespace)

  return null
}
