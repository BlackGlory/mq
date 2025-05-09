import { BadMessageState, IMessage, NotFound } from '@src/contract.js'
import { getMessage } from '@dao/get-message.js'

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export function get(namespace: string, id: string): IMessage {
  try {
    const message = getMessage(namespace, id)
    return message
  } catch (e) {
    if (e instanceof NotFound) throw new NotFound(e.message)
    if (e instanceof BadMessageState) throw new BadMessageState(e.message)
    throw e
  }
}
