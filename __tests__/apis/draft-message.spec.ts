import { beforeEach, afterEach, expect, test, vi, describe } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior, MessageState, QueueNotFound } from '@src/contract.js'
import { getRawMessage, getRawMessageSlot } from '@test/dao.js'
import { getErrorAsync } from 'return-style'

beforeEach(startService)
afterEach(stopService)

describe('draftMessage', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'

    const err = await getErrorAsync(() => client.draftMessage(queueId, null, ['slot']))

    expect(err).toBeInstanceOf(QueueNotFound)
  })

  test('queue exists', async () => {
    try {
      vi.useFakeTimers({ now: 100 })
      const client = await buildClient()
      const queueId = 'queue-id'
      await client.setQueue(queueId, {
        unique: false
      , draftingTimeout: 60_000
      , orderedTimeout: 60_000
      , activeTimeout: 60_000
      , concurrency: null
      , behaviorWhenAbandoned: AdditionalBehavior.None
      , behaviorWhenCompleted: AdditionalBehavior.None
      })

      const priority = null
      const messageId = await client.draftMessage(queueId, priority, ['slot'])

      expect(await client.getQueueStats(queueId)).toMatchObject({
        drafting: 1
      })
      expect(getRawMessage(queueId, messageId)).toMatchObject({
        priority
      , hash: null
      , state: MessageState.Drafting
      , state_updated_at: 100
      })
      expect(getRawMessageSlot(queueId, messageId, 'slot')).toMatchObject({
        value: null
      })
    } finally {
      vi.useRealTimers()
    }
  })
})
