import { peekMessage as _peekMessage } from '@dao/peek-message.js'
import { hasQueue } from '@dao/has-queue.js'
import { IMessage, QueueNotFound } from '@src/contract.js'
import { getDatabase } from '@src/database.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'

/**
 * @throws {QueueNotFound}
 */
export const peekMessage = withLazyStatic((
  queueId: string
, messageId: string
): IMessage | null => {
  return lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  ): IMessage | null => {
    if (!hasQueue(queueId)) throw new QueueNotFound()

    return _peekMessage(queueId, messageId)
  }), [getDatabase()])(queueId, messageId)
})
