import { abandonMessage } from '@dao/abandon-message.js'
import { NotFound } from '@src/contract.js'

/**
 * @throws {NotFound}
 */
export function abandon(namespace: string, id: string): null {
  try {
    abandonMessage(namespace, id)

    return null
  } catch (e) {
    if (e instanceof NotFound) throw new NotFound(e.message)
    throw e
  }
}
