import { beforeEach, afterEach, expect, test, describe, vi } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior, MessageState, QueueNotFound } from '@src/contract.js'
import { getErrorAsync } from 'return-style'
import { getRawMessage } from '@test/dao.js'

beforeEach(startService)
afterEach(stopService)

describe('renewAllFailedMessages', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'

    const err = await getErrorAsync(() => client.renewAllFailedMessages(queueId))

    expect(err).toBeInstanceOf(QueueNotFound)
  })

  test('queue exists', async () => {
    try {
      vi.useFakeTimers({ now: 0 })
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
      const slotName = 'slot'
      const messageId = await client.draftMessage(queueId, null, [slotName])
      const value = 'value'
      await client.setMessageSlot(queueId, messageId, slotName, value)
      expect(await client.orderMessage(queueId)).toBe(messageId)
      await client.getMessage(queueId, messageId)
      await client.failMessage(queueId, messageId)

      vi.advanceTimersByTime(100)
      await client.renewAllFailedMessages(queueId)

      expect(await client.getQueueStats(queueId)).toMatchObject({
        waiting: 1
      , failed: 0
      })
      expect(await client.getMessage(queueId, messageId)).toMatchObject({
        state: MessageState.Waiting
      })
      expect(getRawMessage(queueId, messageId)).toMatchObject({
        state_updated_at: 100
      })
    } finally {
      vi.useRealTimers()
    }
  })
})
