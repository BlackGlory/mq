import { beforeEach, afterEach, expect, test, describe, vi } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior, MessageState } from '@src/contract.js'
import { SyncDestructor } from 'extra-defer'
import { startMaintainer } from '@src/maintainer.js'
import { getRawMessage, hasRawMessage } from './dao.js'

describe('maintainer', () => {
  describe('behaviors on startup', () => {
    beforeEach(() => startService({ maintainer: false }))
    afterEach(stopService)

    test('drafting timeout', async () => {
      const destructor = new SyncDestructor()
      try {
        vi.useFakeTimers({ now: 0 })
        const client = await buildClient()
        const queueId = 'queue-id'
        await client.setQueue(queueId, {
          unique: false
        , draftingTimeout: 100
        , orderedTimeout: 60_000
        , activeTimeout: 60_000
        , concurrency: null
        , behaviorWhenAbandoned: AdditionalBehavior.None
        , behaviorWhenCompleted: AdditionalBehavior.None
        })
        const messageId = await client.draftMessage(queueId, null, ['slot'])

        vi.advanceTimersByTime(100)
        const messageExists1 = hasRawMessage(queueId, messageId)
        destructor.defer(startMaintainer())
        const messageExists2 = hasRawMessage(queueId, messageId)

        expect(messageExists1).toBe(true)
        expect(messageExists2).toBe(false)
      } finally {
        destructor.execute()
        vi.useRealTimers()
      }
    })

    test('ordered timeout', async () => {
      const destructor = new SyncDestructor()
      try {
        vi.useFakeTimers({ now: 0 })
        const client = await buildClient()
        const queueId = 'queue-id'
        await client.setQueue(queueId, {
          unique: false
        , draftingTimeout: 60_000
        , orderedTimeout: 100
        , activeTimeout: 60_000
        , concurrency: null
        , behaviorWhenAbandoned: AdditionalBehavior.None
        , behaviorWhenCompleted: AdditionalBehavior.None
        })
        const slotName = 'slot'
        const messageId = await client.draftMessage(queueId, null, [slotName])
        await client.setMessageSlot(queueId, messageId, slotName, 'value')
        expect(await client.orderMessage(queueId)).toBe(messageId)

        vi.advanceTimersByTime(100)
        const messageSnapshot1 = getRawMessage(queueId, messageId)
        destructor.defer(startMaintainer())
        const messageSnapshot2 = getRawMessage(queueId, messageId)

        expect(messageSnapshot1).toMatchObject({
          state: MessageState.Ordered
        , state_updated_at: 0
        })
        expect(messageSnapshot2).toMatchObject({
          state: MessageState.Waiting
        , state_updated_at: 100
        })
      } finally {
        destructor.execute()
        vi.useRealTimers()
      }
    })

    test('active timeout', async () => {
      const destructor = new SyncDestructor()
      try {
        vi.useFakeTimers({ now: 0 })
        const client = await buildClient()
        const queueId = 'queue-id'
        await client.setQueue(queueId, {
          unique: false
        , draftingTimeout: 60_000
        , orderedTimeout: 60_000
        , activeTimeout: 100
        , concurrency: null
        , behaviorWhenAbandoned: AdditionalBehavior.None
        , behaviorWhenCompleted: AdditionalBehavior.None
        })
        const slotName = 'slot'
        const messageId = await client.draftMessage(queueId, null, [slotName])
        await client.setMessageSlot(queueId, messageId, slotName, 'value')
        expect(await client.orderMessage(queueId)).toBe(messageId)
        await client.getMessage(queueId, messageId)

        vi.advanceTimersByTime(100)
        const messageSnapshot1 = getRawMessage(queueId, messageId)
        destructor.defer(startMaintainer())
        const messageSnapshot2 = getRawMessage(queueId, messageId)

        expect(messageSnapshot1).toMatchObject({
          state: MessageState.Active
        , state_updated_at: 0
        })
        expect(messageSnapshot2).toMatchObject({
          state: MessageState.Waiting
        , state_updated_at: 100
        })
      } finally {
        destructor.execute()
        vi.useRealTimers()
      }
    })
  })

  describe('behaviors after startup', () => {
    beforeEach(startService)
    afterEach(stopService)

    test('drafting timeout', async () => {
      const destructor = new SyncDestructor()
      try {
        vi.useFakeTimers({ now: 0 })
        const client = await buildClient()
        const queueId = 'queue-id'
        await client.setQueue(queueId, {
          unique: false
        , draftingTimeout: 100
        , orderedTimeout: 60_000
        , activeTimeout: 60_000
        , concurrency: null
        , behaviorWhenAbandoned: AdditionalBehavior.None
        , behaviorWhenCompleted: AdditionalBehavior.None
        })

        const messageId = await client.draftMessage(queueId, null, ['slot'])
        vi.advanceTimersByTime(99)
        const messageExists1 = hasRawMessage(queueId, messageId)
        vi.advanceTimersByTime(1)
        const messageExists2 = hasRawMessage(queueId, messageId)

        expect(messageExists1).toBe(true)
        expect(messageExists2).toBe(false)
      } finally {
        destructor.execute()
        vi.useRealTimers()
      }
    })

    test('ordered timeout', async () => {
      const destructor = new SyncDestructor()
      try {
        vi.useFakeTimers({ now: 0 })
        const client = await buildClient()
        const queueId = 'queue-id'
        await client.setQueue(queueId, {
          unique: false
        , draftingTimeout: 60_000
        , orderedTimeout: 100
        , activeTimeout: 60_000
        , concurrency: null
        , behaviorWhenAbandoned: AdditionalBehavior.None
        , behaviorWhenCompleted: AdditionalBehavior.None
        })
        const slotName = 'slot'
        const messageId = await client.draftMessage(queueId, null, [slotName])
        await client.setMessageSlot(queueId, messageId, slotName, 'value')

        expect(await client.orderMessage(queueId)).toBe(messageId)
        vi.advanceTimersByTime(99)
        const messageSnapshot1 = getRawMessage(queueId, messageId)
        vi.advanceTimersByTime(1)
        const messageSnapshot2 = getRawMessage(queueId, messageId)

        expect(messageSnapshot1).toMatchObject({
          state: MessageState.Ordered
        , state_updated_at: 0
        })
        expect(messageSnapshot2).toMatchObject({
          state: MessageState.Waiting
        , state_updated_at: 100
        })
      } finally {
        destructor.execute()
        vi.useRealTimers()
      }
    })

    test('active timeout', async () => {
      const destructor = new SyncDestructor()
      try {
        vi.useFakeTimers({ now: 0 })
        const client = await buildClient()
        const queueId = 'queue-id'
        await client.setQueue(queueId, {
          unique: false
        , draftingTimeout: 60_000
        , orderedTimeout: 60_000
        , activeTimeout: 100
        , concurrency: null
        , behaviorWhenAbandoned: AdditionalBehavior.None
        , behaviorWhenCompleted: AdditionalBehavior.None
        })
        const slotName = 'slot'
        const messageId = await client.draftMessage(queueId, null, [slotName])
        await client.setMessageSlot(queueId, messageId, slotName, 'value')

        expect(await client.orderMessage(queueId)).toBe(messageId)
        await client.getMessage(queueId, messageId)
        vi.advanceTimersByTime(99)
        const messageSnapshot1 = getRawMessage(queueId, messageId)
        vi.advanceTimersByTime(1)
        const messageSnapshot2 = getRawMessage(queueId, messageId)

        expect(messageSnapshot1).toMatchObject({
          state: MessageState.Active
        , state_updated_at: 0
        })
        expect(messageSnapshot2).toMatchObject({
          state: MessageState.Waiting
        , state_updated_at: 100
        })
      } finally {
        destructor.execute()
        vi.useRealTimers()
      }
    })
  })
})
