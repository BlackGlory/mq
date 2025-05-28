import { getDatabase } from '@src/database.js'
import { BadMessageState, MessageNotFound, MessageState } from '@src/contract.js'
import { increaseFailed, increaseWaiting } from './increase-queue-stats.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { getMessageState } from './get-message-state.js'
import { isNull } from 'extra-utils'

/**
 * @throws {MessageNotFound}
 * @throws {BadMessageState}
 */
export const renewMessage = withLazyStatic((
  queueId: string
, messageId: string
, timestamp: number
): void => {
  lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  , timestamp: number
  ): void => {
    const messageState = getMessageState(queueId, messageId)
    if (isNull(messageState)) throw new MessageNotFound()
    if (messageState !== MessageState.Failed) {
      throw new BadMessageState(MessageState.Failed)
    }

    lazyStatic(() => getDatabase().prepare<{
      queueId: string
      messageId: string
      stateUpdatedAt: number
    }>(`
      UPDATE mq_message
         SET state = ${MessageState.Waiting}
           , state_updated_at = $stateUpdatedAt
       WHERE queue_id = $queueId
         AND id = $messageId;
    `), [getDatabase()]).run({
      queueId
    , messageId
    , stateUpdatedAt: timestamp
    })

    increaseFailed(queueId, -1)
    increaseWaiting(queueId, 1)
  }), [getDatabase()])(queueId, messageId, timestamp)
})
