import { beforeEach, afterEach, expect, test, describe } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior } from '@src/contract.js'

beforeEach(startService)
afterEach(stopService)

describe('stats', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'

    const result = await client.getQueueStats(queueId)

    expect(result).toBe(null)
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

    const result = await client.getQueueStats(queueId)

    expect(result).toEqual({
      drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 0
    , failed: 0
    , completed: 0
    , abandoned: 0
    })
  })
})
