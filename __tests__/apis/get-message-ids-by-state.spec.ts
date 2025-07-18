import { beforeEach, afterEach, expect, test, describe } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior, MessageState, QueueNotFound } from '@src/contract.js'
import { getErrorAsync } from 'return-style'

beforeEach(startService)
afterEach(stopService)

describe('getMessageIdsByState', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'

    const err = await getErrorAsync(() => client.getMessageIdsByState(queueId, MessageState.Drafting))

    expect(err).toBeInstanceOf(QueueNotFound)
  })

  test('queue exists', async () => {
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

    const result = await client.getMessageIdsByState(queueId, MessageState.Drafting)

    expect(result).toStrictEqual([messageId])
  })
})
