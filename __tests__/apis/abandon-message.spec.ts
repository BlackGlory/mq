import { beforeEach, afterEach, expect, test, describe, vi } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior, MessageNotFound, MessageState, QueueNotFound } from '@src/contract.js'
import { getErrorAsync } from 'return-style'
import { getRawMessage } from '@test/dao.js'

beforeEach(startService)
afterEach(stopService)

describe('abandonMessage', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'
    const messageId = 'message-id'

    const err = await getErrorAsync(() => client.abandonMessage(queueId, messageId))

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

      const err = await getErrorAsync(() => client.abandonMessage(queueId, messageId))

      expect(err).toBeInstanceOf(MessageNotFound)
    })

    describe('message exists', () => {
      test('behavior when abandoned: none', async () => {
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

          vi.advanceTimersByTime(100)
          await client.abandonMessage(queueId, messageId)

          expect(await client.getQueueStats(queueId)).toMatchObject({
            drafting: 0
          , abandoned: 1
          })
          expect(await client.getMessage(queueId, messageId)).toMatchObject({
            slots: {}
          , state: MessageState.Abandoned
          })
          expect(getRawMessage(queueId, messageId)).toMatchObject({
            state_updated_at: 100
          })
        } finally {
          vi.useRealTimers()
        }
      })

      test('behavior when abandoned: remove message', async () => {
        const client = await buildClient()
        const queueId = 'queue-id'
        await client.setQueue(queueId, {
          unique: false
        , draftingTimeout: 60_000
        , orderedTimeout: 60_000
        , activeTimeout: 60_000
        , concurrency: null
        , behaviorWhenAbandoned: AdditionalBehavior.RemoveMessage
        , behaviorWhenCompleted: AdditionalBehavior.None
        })
        const slotName = 'slot'
        const messageId = await client.draftMessage(queueId, null, [slotName])

        await client.abandonMessage(queueId, messageId)

        expect(await client.getQueueStats(queueId)).toMatchObject({
          drafting: 0
        , abandoned: 1
        })
        expect(await client.getMessage(queueId, messageId)).toBe(null)
      })

      test('behavior when abandoned: remove all slots', async () => {
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
          , behaviorWhenAbandoned: AdditionalBehavior.RemoveAllSlots
          , behaviorWhenCompleted: AdditionalBehavior.None
          })
          const slotName = 'slotName'
          const messageId = await client.draftMessage(queueId, null, [slotName])

          vi.advanceTimersByTime(100)
          await client.abandonMessage(queueId, messageId)

          expect(await client.getQueueStats(queueId)).toMatchObject({
            drafting: 0
          , abandoned: 1
          })
          expect(await client.getMessage(queueId, messageId)).toMatchObject({
            slots: {}
          , state: MessageState.Abandoned
          })
          expect(getRawMessage(queueId, messageId)).toMatchObject({
            state_updated_at: 100
          })
        } finally {
          vi.useRealTimers()
        }
      })
    })
  })
})
