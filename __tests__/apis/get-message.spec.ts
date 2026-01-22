import { beforeEach, afterEach, expect, test, describe, vi } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior, MessageState, QueueNotFound } from '@src/contract.js'
import { getErrorAsync } from 'return-style'
import { getRawMessage } from '@test/dao.js'

beforeEach(startService)
afterEach(stopService)

describe('getMessage', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'
    const messageId = 'message-id'

    const err = await getErrorAsync(() => client.getMessage(queueId, messageId))

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

      const result = await client.getMessage(queueId, messageId)

      expect(result).toBe(null)
    })

    describe('message exists', () => {
      test('state: ordered', async () => {
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
          const result = await client.getMessage(queueId, messageId)

          expect(result).toStrictEqual({
            slots: { [slotName]: value }
          , priority
          , state: MessageState.Active
          })
          expect(await client.getQueueStats(queueId)).toMatchObject({
            ordered: 0
          , active: 1
          })
          expect(getRawMessage(queueId, messageId)).toMatchObject({
            state_updated_at: 100
          })
        } finally {
          vi.useRealTimers()
        }
      })

      test('other states', async () => {
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

        const result = await client.getMessage(queueId, messageId)

        expect(result).toStrictEqual({
          slots: {}
        , priority
        , state: MessageState.Drafting
        })
      })
    })
  })
})
