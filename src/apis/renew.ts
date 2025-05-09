import { renewMessage } from '@dao/renew-message.js'
import { BadMessageState, NotFound } from '@src/contract.js'
import * as SignalDAO from '@dao/signal.js'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export function renew(namespace: string, id: string): null {
  try {
    renewMessage(namespace, id)
    queueMicrotask(() => SignalDAO.emit(namespace))

    return null
  } catch (e) {
    if (e instanceof NotFound) throw new NotFound(e.message)
    if (e instanceof BadMessageState) throw new BadMessageState(e.message)
    throw e
  }
}
