import { renewAllFailedMessages as _renewAllFailedMessages } from '@dao/renew-all-failed-messages.js'
import * as SignalDAO from '@dao/signal.js'

export function renewAllFailedMessages(namespace: string): null {
  _renewAllFailedMessages(namespace)
  queueMicrotask(() => SignalDAO.emit(namespace))

  return null
}
