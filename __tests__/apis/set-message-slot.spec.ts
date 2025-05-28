import { beforeEach, afterEach, expect, test, describe, vi } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior, BadMessageState, DuplicateMessage, MessageNotFound, MessageState, QueueNotFound, SlotNotFound } from '@src/contract.js'
import { getErrorAsync } from 'return-style'
import { getRawMessage } from '@test/dao.js'

beforeEach(startService)
afterEach(stopService)

describe('setMessageSlot', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'
    const messageId = 'message-id'
    const slotName = 'slot'

    const err = await getErrorAsync(() => client.setMessageSlot(
      queueId
    , messageId
    , slotName
    , 'value'
    ))

    expect(err).toBeInstanceOf(QueueNotFound)
  })

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
    const slotName = 'slot'

    const err = await getErrorAsync(() => client.setMessageSlot(
      queueId
    , messageId
    , slotName
    , 'value'
    ))

    expect(err).toBeInstanceOf(MessageNotFound)
  })

  test('slot does not exist', async () => {
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
    const messageId = await client.draftMessage(queueId, null, ['another-slot'])
    const slotName = 'slot'

    const err = await getErrorAsync(() => client.setMessageSlot(
      queueId
    , messageId
    , slotName
    , 'value'
    ))

    expect(err).toBeInstanceOf(SlotNotFound)
  })

  describe('slot exists', () => {
    describe('state: drafting', () => {
      test('not last slot', async () => {
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
        const slotName1 = 'foo'
        const slotName2 = 'bar'
        const messageId = await client.draftMessage(queueId, priority, [slotName1, slotName2])

        await client.setMessageSlot(
          queueId
        , messageId
        , slotName1
        , 'value-1'
        )

        expect(await client.getMessage(queueId, messageId)).toStrictEqual({
          slots: {
            [slotName1]: 'value-1'
          }
        , priority
        , state: MessageState.Drafting
        })
        expect(getRawMessage(queueId, messageId)).toMatchObject({
          hash: null
        })
      })

      describe('last slot', () => {
        describe('unique: false', async () => {
          test('non-duplicated', async () => {
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
              const messageId = await client.draftMessage(queueId, priority, [slotName])

              vi.advanceTimersByTime(100)
              await client.setMessageSlot(
                queueId
              , messageId
              , slotName
              , 'value'
              )

              expect(await client.getQueueStats(queueId)).toMatchObject({
                drafting: 0
              , waiting: 1
              })
              expect(await client.getMessage(queueId, messageId)).toStrictEqual({
                slots: {
                  [slotName]: 'value'
                }
              , priority
              , state: MessageState.Waiting
              })
              expect(getRawMessage(queueId, messageId)).toMatchObject({
                hash: null
              , state_updated_at: 100
              })
            } finally {
              vi.useRealTimers()
            }
          })

          test('duplicated', async () => {
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
              const messageId1 = await client.draftMessage(queueId, priority, [slotName])
              await client.setMessageSlot(
                queueId
              , messageId1
              , slotName
              , 'value'
              )
              const messageId2 = await client.draftMessage(queueId, priority, [slotName])

              vi.advanceTimersByTime(100)
              await client.setMessageSlot(
                queueId
              , messageId2
              , slotName
              , 'value'
              )

              expect(await client.getQueueStats(queueId)).toMatchObject({
                drafting: 0
              , waiting: 2
              })
              expect(await client.getMessage(queueId, messageId2)).toStrictEqual({
                slots: {
                  [slotName]: 'value'
                }
              , priority
              , state: MessageState.Waiting
              })
              expect(getRawMessage(queueId, messageId2)).toMatchObject({
                hash: null
              , state_updated_at: 100
              })
            } finally {
              vi.useRealTimers()
            }
          })
        })

        describe('unique: true', () => {
          test('non-duplicated', async () => {
            try {
              vi.useFakeTimers({ now: 0 })
              const client = await buildClient()
              const queueId = 'queue-id'
              await client.setQueue(queueId, {
                unique: true
              , draftingTimeout: 60_000
              , orderedTimeout: 60_000
              , activeTimeout: 60_000
              , concurrency: null
              , behaviorWhenAbandoned: AdditionalBehavior.None
              , behaviorWhenCompleted: AdditionalBehavior.None
              })
              const priority = null
              const slotName = 'slot'
              const messageId = await client.draftMessage(queueId, priority, [slotName])

              vi.advanceTimersByTime(100)
              await client.setMessageSlot(
                queueId
              , messageId
              , slotName
              , 'value'
              )

              expect(await client.getQueueStats(queueId)).toMatchObject({
                drafting: 0
              , waiting: 1
              })
              expect(await client.getMessage(queueId, messageId)).toStrictEqual({
                slots: {
                  [slotName]: 'value'
                }
              , priority
              , state: MessageState.Waiting
              })
              expect(getRawMessage(queueId, messageId)).toMatchObject({
                hash: expect.any(String)
              , state_updated_at: 100
              })
            } finally {
              vi.useRealTimers()
            }
          })

          test('duplicated', async () => {
            const client = await buildClient()
            const queueId = 'queue-id'
            await client.setQueue(queueId, {
              unique: true
            , draftingTimeout: 60_000
            , orderedTimeout: 60_000
            , activeTimeout: 60_000
            , concurrency: null
            , behaviorWhenAbandoned: AdditionalBehavior.None
            , behaviorWhenCompleted: AdditionalBehavior.None
            })
            const priority = null
            const slotName = 'slot'
            const messageId1 = await client.draftMessage(queueId, priority, [slotName])
            await client.setMessageSlot(
              queueId
            , messageId1
            , slotName
            , 'value'
            )
            const messageId2 = await client.draftMessage(queueId, priority, [slotName])

            const err = await getErrorAsync(() => client.setMessageSlot(
              queueId
            , messageId2
            , slotName
            , 'value'
            ))

            expect(err).toBeInstanceOf(DuplicateMessage)
            expect(await client.getMessage(queueId, messageId2)).toStrictEqual({
              slots: {}
            , priority
            , state: MessageState.Drafting
            })
          })
        })
      })
    })

    describe('state: waiting', () => {
      describe('unique: false', () => {
        test('non-duplicated', async () => {
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
          const messageId = await client.draftMessage(queueId, priority, [slotName])
          await client.setMessageSlot(
            queueId
          , messageId
          , slotName
          , 'value'
          )

          await client.setMessageSlot(
            queueId
          , messageId
          , slotName
          , 'new-value'
          )

          expect(await client.getMessage(queueId, messageId)).toStrictEqual({
            slots: {
              [slotName]: 'new-value'
            }
          , priority
          , state: MessageState.Waiting
          })
        })

        test('duplicated', async () => {
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
          const messageId1 = await client.draftMessage(queueId, priority, [slotName])
          await client.setMessageSlot(
            queueId
          , messageId1
          , slotName
          , 'value'
          )
          const messageId2 = await client.draftMessage(queueId, priority, [slotName])
          await client.setMessageSlot(
            queueId
          , messageId2
          , slotName
          , 'another-value'
          )

          await client.setMessageSlot(
            queueId
          , messageId2
          , slotName
          , 'value'
          )

          expect(await client.getMessage(queueId, messageId2)).toStrictEqual({
            slots: {
              [slotName]: 'value'
            }
          , priority
          , state: MessageState.Waiting
          })
        })
      })

      describe('unique: true', () => {
        test('non-duplicated', async () => {
          const client = await buildClient()
          const queueId = 'queue-id'
          await client.setQueue(queueId, {
            unique: true
          , draftingTimeout: 60_000
          , orderedTimeout: 60_000
          , activeTimeout: 60_000
          , concurrency: null
          , behaviorWhenAbandoned: AdditionalBehavior.None
          , behaviorWhenCompleted: AdditionalBehavior.None
          })
          const priority = null
          const slotName = 'slot'
          const messageId = await client.draftMessage(queueId, priority, [slotName])
          await client.setMessageSlot(
            queueId
          , messageId
          , slotName
          , 'value'
          )

          await client.setMessageSlot(
            queueId
          , messageId
          , slotName
          , 'new-value'
          )

          expect(await client.getMessage(queueId, messageId)).toStrictEqual({
            slots: {
              [slotName]: 'new-value'
            }
          , priority
          , state: MessageState.Waiting
          })
        })

        test('duplicated', async () => {
          const client = await buildClient()
          const queueId = 'queue-id'
          await client.setQueue(queueId, {
            unique: true
          , draftingTimeout: 60_000
          , orderedTimeout: 60_000
          , activeTimeout: 60_000
          , concurrency: null
          , behaviorWhenAbandoned: AdditionalBehavior.None
          , behaviorWhenCompleted: AdditionalBehavior.None
          })
          const priority = null
          const slotName = 'slot'
          const messageId1 = await client.draftMessage(queueId, priority, [slotName])
          await client.setMessageSlot(
            queueId
          , messageId1
          , slotName
          , 'value'
          )
          const messageId2 = await client.draftMessage(queueId, priority, [slotName])
          await client.setMessageSlot(
            queueId
          , messageId2
          , slotName
          , 'another-value'
          )

          const err = await getErrorAsync(() => client.setMessageSlot(
            queueId
          , messageId2
          , slotName
          , 'value'
          ))

          expect(err).toBeInstanceOf(DuplicateMessage)
          expect(await client.getMessage(queueId, messageId2)).toStrictEqual({
            slots: {
              [slotName]: 'another-value'
            }
          , priority
          , state: MessageState.Waiting
          })
        })
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
      const slotName = 'slot'
      const messageId = await client.draftMessage(queueId, null, [slotName])
      await client.setMessageSlot(
        queueId
      , messageId
      , slotName
      , 'value'
      )
      expect(await client.orderMessage(queueId)).toBe(messageId)

      const err = await getErrorAsync(() => client.setMessageSlot(queueId, messageId, slotName, 'new-value'))

      expect(err).toBeInstanceOf(BadMessageState)
    })
  })
})
