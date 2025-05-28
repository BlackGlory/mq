import { beforeEach, afterEach, expect, test, describe, vi } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior, MessageState, QueueNotFound } from '@src/contract.js'
import { getErrorAsync, getErrorPromise } from 'return-style'
import { getRawMessage } from '@test/dao.js'
import { StatefulPromise, StatefulPromiseState } from 'extra-promise'
import { waitForAllMicrotasksProcessed } from '@blackglory/wait-for'
import { AbortError } from 'extra-abort'

beforeEach(startService)
afterEach(stopService)

describe('orderMessage', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'

    const err = await getErrorAsync(() => client.orderMessage(queueId))

    expect(err).toBeInstanceOf(QueueNotFound)
  })

  describe('queue exists', () => {
    test('empty queue', async () => {
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

        const promise = new StatefulPromise((resolve, reject) => client.orderMessage(queueId).then(resolve, reject))
        await waitForAllMicrotasksProcessed()
        const state1 = promise.state
        vi.advanceTimersByTime(100)
        await client.setMessageSlot(queueId, messageId, slotName, 'value')
        await waitForAllMicrotasksProcessed()
        const state2 = promise.state
        const result = await promise

        expect(state1).toBe(StatefulPromiseState.Pending)
        expect(state2).toBe(StatefulPromiseState.Fulfilled)
        expect(result).toBe(messageId)
        expect(await client.getQueueStats(queueId)).toMatchObject({
          waiting: 0
        , ordered: 1
        })
        expect(getRawMessage(queueId, messageId)).toMatchObject({
          state: MessageState.Ordered
        , state_updated_at: 100
        })
      } finally {
        vi.useRealTimers()
      }
    })

    describe('non-empty queue', async () => {
      test('priority', async () => {
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
        const messageId1 = await client.draftMessage(queueId, 0, [slotName])
        await client.setMessageSlot(queueId, messageId1, slotName, 'value')
        const messageId2 = await client.draftMessage(queueId, -1, [slotName])
        await client.setMessageSlot(queueId, messageId2, slotName, 'value')
        const messageId3 = await client.draftMessage(queueId, 1, [slotName])
        await client.setMessageSlot(queueId, messageId3, slotName, 'value')
        const messageId4 = await client.draftMessage(queueId, null, [slotName])
        await client.setMessageSlot(queueId, messageId4, slotName, 'value')

        const result1 = await client.orderMessage(queueId)
        const result2 = await client.orderMessage(queueId)
        const result3 = await client.orderMessage(queueId)
        const result4 = await client.orderMessage(queueId)

        expect(result1).toBe(messageId3)
        expect(result2).toBe(messageId1)
        expect(result3).toBe(messageId2)
        expect(result4).toBe(messageId4)
      })

      describe('concurrency', () => {
        test('ordered + active < concurrency', async () => {
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
            await client.setMessageSlot(queueId, messageId, slotName, 'value')

            vi.advanceTimersByTime(100)
            const result = await client.orderMessage(queueId)

            expect(result).toBe(messageId)
            expect(await client.getQueueStats(queueId)).toMatchObject({
              waiting: 0
            , ordered: 1
            })
            expect(getRawMessage(queueId, messageId)).toMatchObject({
              state: MessageState.Ordered
            , state_updated_at: 100
            })
          } finally {
            vi.useRealTimers()
          }
        })

        test('ordered + active = concurrency', async () => {
          try {
            vi.useFakeTimers({ now: 0 })
            const client = await buildClient()
            const queueId = 'queue-id'
            await client.setQueue(queueId, {
              unique: false
            , draftingTimeout: 60_000
            , orderedTimeout: 60_000
            , activeTimeout: 60_000
            , concurrency: 1
            , behaviorWhenAbandoned: AdditionalBehavior.None
            , behaviorWhenCompleted: AdditionalBehavior.None
            })
            const slotName = 'slot'
            const messageId1 = await client.draftMessage(queueId, null, [slotName])
            const messageId2 = await client.draftMessage(queueId, null, [slotName])
            await client.setMessageSlot(queueId, messageId1, slotName, 'value')
            await client.setMessageSlot(queueId, messageId2, slotName, 'value')
            expect(await client.orderMessage(queueId)).toBe(messageId1)
            await client.getMessage(queueId, messageId1)

            vi.advanceTimersByTime(100)
            const promise = new StatefulPromise((resolve, reject) => client.orderMessage(queueId).then(resolve, reject))
            await waitForAllMicrotasksProcessed()
            const state1 = promise.state
            await client.completeMessage(queueId, messageId1)
            await waitForAllMicrotasksProcessed()
            const state2 = promise.state
            const result = await promise

            expect(state1).toBe(StatefulPromiseState.Pending)
            expect(state2).toBe(StatefulPromiseState.Fulfilled)
            expect(result).toBe(messageId2)
            expect(await client.getQueueStats(queueId)).toMatchObject({
              waiting: 0
            , ordered: 1
            , completed: 1
            })
            expect(getRawMessage(queueId, messageId2)).toMatchObject({
              state: MessageState.Ordered
            , state_updated_at: 100
            })
          } finally {
            vi.useRealTimers()
          }
        })

        test('ordered + active < new concurrency', async () => {
          try {
            vi.useFakeTimers({ now: 0 })
            const client = await buildClient()
            const queueId = 'queue-id'
            await client.setQueue(queueId, {
              unique: false
            , draftingTimeout: 60_000
            , orderedTimeout: 60_000
            , activeTimeout: 60_000
            , concurrency: 1
            , behaviorWhenAbandoned: AdditionalBehavior.None
            , behaviorWhenCompleted: AdditionalBehavior.None
            })
            const slotName = 'slot'
            const messageId1 = await client.draftMessage(queueId, null, [slotName])
            const messageId2 = await client.draftMessage(queueId, null, [slotName])
            await client.setMessageSlot(queueId, messageId1, slotName, 'value')
            await client.setMessageSlot(queueId, messageId2, slotName, 'value')
            expect(await client.orderMessage(queueId)).toBe(messageId1)

            vi.advanceTimersByTime(100)
            const promise = new StatefulPromise((resolve, reject) => client.orderMessage(queueId).then(resolve, reject))
            await waitForAllMicrotasksProcessed()
            const state1 = promise.state
            await client.setQueue(queueId, {
              unique: false
            , draftingTimeout: 60_000
            , orderedTimeout: 60_000
            , activeTimeout: 60_000
            , concurrency: 2
            , behaviorWhenAbandoned: AdditionalBehavior.None
            , behaviorWhenCompleted: AdditionalBehavior.None
            })
            await waitForAllMicrotasksProcessed()
            const state2 = promise.state
            const result = await promise

            expect(state1).toBe(StatefulPromiseState.Pending)
            expect(state2).toBe(StatefulPromiseState.Fulfilled)
            expect(result).toBe(messageId2)
            expect(await client.getQueueStats(queueId)).toMatchObject({
              waiting: 0
            , ordered: 2
            })
            expect(getRawMessage(queueId, messageId2)).toMatchObject({
              state: MessageState.Ordered
            , state_updated_at: 100
            })
          } finally {
            vi.useRealTimers()
          }
        })
      })
    })

    test('cancel request', async () => {
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

      const controller = new AbortController()
      const promise1 = getErrorAsync(() => client.orderMessage(queueId, controller.signal))
      const promise2 = client.orderMessage(queueId)
      await waitForAllMicrotasksProcessed()
      controller.abort()
      await waitForAllMicrotasksProcessed()
      await client.setMessageSlot(queueId, messageId, slotName, 'value')
      await waitForAllMicrotasksProcessed()
      const err = await promise1
      const result = await promise2

      expect(err).toBeInstanceOf(AbortError)
      expect(result).toBe(messageId)
      expect(await client.getQueueStats(queueId)).toMatchObject({
        waiting: 0
      , ordered: 1
      })
      expect(getRawMessage(queueId, messageId)).toMatchObject({
        state: MessageState.Ordered
      })
    })

    test('remove queue while ordering', async () => {
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

      const promise = new StatefulPromise((resolve, reject) => client.orderMessage(queueId).then(resolve, reject))
      await waitForAllMicrotasksProcessed()
      const state1 = promise.state
      await client.removeQueue(queueId)
      await waitForAllMicrotasksProcessed()
      const state2 = promise.state
      const err = await getErrorPromise(promise)

      expect(state1).toBe(StatefulPromiseState.Pending)
      expect(state2).toBe(StatefulPromiseState.Rejected)
      expect(err).toBeInstanceOf(QueueNotFound)
    })

    test('reset queue while ordering', async () => {
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

      const promise = new StatefulPromise((resolve, reject) => client.orderMessage(queueId).then(resolve, reject))
      await waitForAllMicrotasksProcessed()
      const state1 = promise.state
      await client.resetQueue(queueId)
      const slotName = 'slot'
      const messageId = await client.draftMessage(queueId, null, [slotName])
      await client.setMessageSlot(queueId, messageId, slotName, 'value')
      await waitForAllMicrotasksProcessed()
      const state2 = promise.state
      const result = await promise

      expect(state1).toBe(StatefulPromiseState.Pending)
      expect(state2).toBe(StatefulPromiseState.Fulfilled)
      expect(result).toBe(messageId)
      expect(await client.getQueueStats(queueId)).toMatchObject({
        waiting: 0
      , ordered: 1
      })
      expect(getRawMessage(queueId, messageId)).toMatchObject({
        state: MessageState.Ordered
      })
    })
  })
})
