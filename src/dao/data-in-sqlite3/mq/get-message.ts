import { getDatabase } from '../database'
import { NotFound, BadMessageState } from './error'
import { getTimestamp } from './utils/get-timestamp'
import { downcreaseOrdered, increaseActive } from './utils/stats'
import { State } from './utils/state'

export function getMessage(queueId: string, messageId: string): IMessage {
  const timestamp = getTimestamp()
  const db = getDatabase()

  return db.transaction(() => {
    const row = db.prepare(`
      SELECT type
           , payload
           , state
        FROM mq_message
       WHERE mq_id = $queueId
         AND message_id = $messageId;
    `).get({ queueId, messageId })
    if (!row) throw new NotFound()
    const state = row['state'] as State
    switch(state) {
      case State.Drafting:
        throw new BadMessageState(
          State.Active
        , State.Ordered
        , State.Waiting
        )
      case State.Ordered:
        db.prepare(`
          UPDATE mq_message
            SET state = 'active'
              , state_updated_at = $stateUpdatedAt
          WHERE mq_id = $queueId
            AND message_id = $messageId;
        `).run({
          queueId
        , messageId
        , stateUpdatedAt: timestamp
        })

        downcreaseOrdered(queueId)
        increaseActive(queueId)
        break
    }

    return {
      type: row['type']
    , payload: row['payload']
    }
  })()
}
