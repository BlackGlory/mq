import { beforeEach, afterEach, expect, test, describe } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior, QueueNotFound } from '@src/contract.js'
import { getErrorAsync } from 'return-style'

beforeEach(startService)
afterEach(stopService)

describe('removeMessage', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'
    const messageId = 'message-id'

    const err = await getErrorAsync(() => client.removeMessage(queueId, messageId))

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

      await client.removeMessage(queueId, messageId)

      expect(await client.getMessage(queueId, messageId)).toBe(null)
    })

    test('message exists', async () => {
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

      await client.removeMessage(queueId, messageId)

      expect(await client.getQueueStats(queueId)).toMatchObject({
        drafting: 0
      })
      expect(await client.getMessage(queueId, messageId)).toBe(null)
    })
  })
})
