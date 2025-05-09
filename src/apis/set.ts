import { setMessage } from '@dao/set-message.js'
import { getConfiguration } from '@dao/configuration.js'
import * as SignalDAO from '@dao/signal.js'
import { BadMessageState, DuplicatePayload, NotFound } from '@src/contract.js'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 * @throws {DuplicatePayload}
 */
export function set(
  namespace: string
, id: string
, type: string
, payload: string
): null {
  const configurations = getConfiguration(namespace)
  const unique = configurations.unique ?? false

  try {
    setMessage(namespace, id, type, payload, unique)
    queueMicrotask(() => SignalDAO.emit(namespace))

    return null
  } catch (e) {
    if (e instanceof NotFound) throw new NotFound(e.message)
    if (e instanceof BadMessageState) throw new BadMessageState(e.message)
    if (e instanceof DuplicatePayload) throw new DuplicatePayload(e.message)
    throw e
  }
}
