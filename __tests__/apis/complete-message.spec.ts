import { beforeEach, afterEach, expect, test, describe, vi } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior, BadMessageState, MessageNotFound, MessageState, QueueNotFound } from '@src/contract.js'
import { getErrorAsync } from 'return-style'
import { getRawMessage } from '@test/dao.js'

beforeEach(startService)
afterEach(stopService)

describe('completeMessage', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'
    const messageId = 'message-id'

    const err = await getErrorAsync(() => client.completeMessage(queueId, messageId))

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

      const err = await getErrorAsync(() => client.completeMessage(queueId, messageId))

      expect(err).toBeInstanceOf(MessageNotFound)
    })

    describe('message exists', () => {
      describe('state: active', () => {
        test('behavior when completed: none', async () => {
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

            vi.advanceTimersByTime(100)
            await client.completeMessage(queueId, messageId)

            expect(await client.getQueueStats(queueId)).toMatchObject({
              active: 0
            , completed: 1
            })
            expect(await client.getMessage(queueId, messageId)).toMatchObject({
              slots: { [slotName]: value }
            , state: MessageState.Completed
            })
            expect(getRawMessage(queueId, messageId)).toMatchObject({
              state_updated_at: 100
            })
          } finally {
            vi.useRealTimers()
          }
        })

        test('behavior when completed: remove message', async () => {
          const client = await buildClient()
          const queueId = 'queue-id'
          await client.setQueue(queueId, {
            unique: false
          , draftingTimeout: 60_000
          , orderedTimeout: 60_000
          , activeTimeout: 60_000
          , concurrency: null
          , behaviorWhenAbandoned: AdditionalBehavior.None
          , behaviorWhenCompleted: AdditionalBehavior.RemoveMessage
          })
          const slotName = 'slot'
          const messageId = await client.draftMessage(queueId, null, [slotName])
          const value = 'value'
          await client.setMessageSlot(queueId, messageId, slotName, value)
          expect(await client.orderMessage(queueId)).toBe(messageId)
          await client.getMessage(queueId, messageId)

          await client.completeMessage(queueId, messageId)

          expect(await client.getQueueStats(queueId)).toMatchObject({
            active: 0
          , completed: 1
          })
          expect(await client.getMessage(queueId, messageId)).toBe(null)
        })

        test('behavior when completed: remove all slots', async () => {
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
            , behaviorWhenCompleted: AdditionalBehavior.RemoveAllSlots
            })
            const slotName = 'slotName'
            const messageId = await client.draftMessage(queueId, null, [slotName])
            const value = 'value'
            await client.setMessageSlot(queueId, messageId, slotName, value)
            expect(await client.orderMessage(queueId)).toBe(messageId)
            await client.getMessage(queueId, messageId)

            vi.advanceTimersByTime(100)
            await client.completeMessage(queueId, messageId)

            expect(await client.getQueueStats(queueId)).toMatchObject({
              active: 0
            , completed: 1
            })
            expect(await client.getMessage(queueId, messageId)).toMatchObject({
              slots: {}
            , state: MessageState.Completed
            })
            expect(getRawMessage(queueId, messageId)).toMatchObject({
              state_updated_at: 100
            })
          } finally {
            vi.useRealTimers()
          }
        })
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
        const messageId = await client.draftMessage(queueId, null, ['slot'])

        const err = await getErrorAsync(() => client.completeMessage(queueId, messageId))

        expect(err).toBeInstanceOf(BadMessageState)
      })
    })
  })
})
