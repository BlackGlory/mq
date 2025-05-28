import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { MessageState } from '@src/contract.js'
import { increaseStatByState } from './increase-queue-stats.js'

/**
 * @throws {QueueNotFound}
 * @returns 是否有消息被清除.
 */
export const clearMessagesByState = withLazyStatic((
  queueId: string
, state: MessageState
): boolean => {
  return lazyStatic(() => getDatabase().transaction((
    queueId: string
  , state: MessageState
  ): boolean => {
    const { changes } = lazyStatic(() => getDatabase().prepare<{ queueId: string }>(`
      DELETE FROM mq_message
       WHERE queue_id = $queueId;
    `), [getDatabase()]).run({ queueId })

    increaseStatByState(queueId, state, -changes)

    return changes > 0
  }), [getDatabase()])(queueId, state)
})
