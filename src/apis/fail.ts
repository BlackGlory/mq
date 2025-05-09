import { failMessage } from '@dao/fail-message.js'
import { BadMessageState, NotFound } from '@src/contract.js'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export function fail(namespace: string, id: string): null {
  try {
    failMessage(namespace, id)

    return null
  } catch (e) {
    if (e instanceof NotFound) throw new NotFound(e.message)
    if (e instanceof BadMessageState) throw new BadMessageState(e.message)
    throw e
  }
}
