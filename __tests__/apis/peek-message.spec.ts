import { beforeEach, afterEach, expect, test, describe, vi } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior, MessageState, QueueNotFound } from '@src/contract.js'
import { getErrorAsync } from 'return-style'
import { getRawMessage } from '@test/dao.js'

beforeEach(startService)
afterEach(stopService)

describe('peekMessage', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'
    const messageId = 'message-id'

    const err = await getErrorAsync(() => client.peekMessage(queueId, messageId))

    expect(err).toBeInstanceOf(QueueNotFound)
  })

  describe('queue exists', () => {
    test('message does not exist', async () => {
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
      const messageId = 'message-id'

      const result = await client.peekMessage(queueId, messageId)

      expect(result).toBe(null)
    })

    test('message exists', async () => {
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
        const priority = null
        const slotName = 'slot'
        const value = 'value'
        const messageId = await client.draftMessage(queueId, priority, [slotName])
        await client.setMessageSlot(queueId, messageId, slotName, value)
        expect(await client.orderMessage(queueId)).toBe(messageId)

        vi.advanceTimersByTime(100)
        const result = await client.peekMessage(queueId, messageId)

        expect(result).toStrictEqual({
          slots: { [slotName]: value }
        , priority
        , state: MessageState.Ordered
        })
        expect(await client.getQueueStats(queueId)).toMatchObject({
          ordered: 1
        , active: 0
        })
        expect(getRawMessage(queueId, messageId)).toMatchObject({
          state_updated_at: 0
        })
      } finally {
        vi.useRealTimers()
      }
    })
  })
})
