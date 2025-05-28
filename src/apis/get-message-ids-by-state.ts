import { getMessageIdsByState as _getMessageIdsByState } from '@dao/get-message-ids-by-state.js'
import { hasQueue } from '@dao/has-queue.js'
import { MessageState, QueueNotFound } from '@src/contract.js'
import { getDatabase } from '@src/database.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'

/**
 * @throws {QueueNotFound}
 */
export const getMessageIdsByState = withLazyStatic((
  queueId: string
, state: MessageState
): string[] => {
  return lazyStatic(() => getDatabase().transaction((
    queueId: string
  , state: MessageState
  ): string[] => {
    if (!hasQueue(queueId)) throw new QueueNotFound()

    return _getMessageIdsByState(queueId, state)
  }), [getDatabase()])(queueId, state)
})
