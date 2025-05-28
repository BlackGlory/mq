import { getDatabase } from '@src/database.js'
import { MessageState } from '@src/contract.js'
import { increaseStatByState } from './increase-queue-stats.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

/**
 * @returns 被删除的消息的状态.
 * 如果消息不存在, 则返回`null`.
 */
export const removeMessage = withLazyStatic((
  queueId: string
, messageId: string
): MessageState | null => {
  return lazyStatic(() => getDatabase().transaction((
    queueId: string
  , messageId: string
  ): MessageState | null => {
    const row = lazyStatic(() => getDatabase().prepare<
      {
        queueId: string
        messageId: string
      }
    , { state: MessageState }
    >(`
      DELETE FROM mq_message
       WHERE queue_id = $queueId
         AND id = $messageId
      RETURNING state;
    `), [getDatabase()]).get({ queueId, messageId })
    if (!row) return null

    increaseStatByState(queueId, row.state, -1)

    return row.state
  }), [getDatabase()])(queueId, messageId)
})
