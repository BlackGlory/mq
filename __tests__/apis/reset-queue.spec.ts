import { beforeEach, afterEach, expect, describe, test } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior } from '@src/contract.js'
import { getRawMessageSlot } from '@test/dao.js'

beforeEach(startService)
afterEach(stopService)

describe('resetQueue', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'

    await client.resetQueue(queueId)
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

    await client.resetQueue(queueId)

    expect(await client.getQueueStats(queueId)).toStrictEqual({
      drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 0
    , failed: 0
    , completed: 0
    , abandoned: 0
    })
    expect(await client.getMessage(queueId, messageId)).toBeNull()
    expect(getRawMessageSlot(queueId, messageId, 'slot')).toBeUndefined()
  })
})
