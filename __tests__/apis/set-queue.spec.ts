import { beforeEach, afterEach, expect, test, describe } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior, IQueueConfig } from '@src/contract.js'

beforeEach(startService)
afterEach(stopService)

describe('setQueue', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'
    const config: IQueueConfig = {
      unique: false
    , draftingTimeout: 60_000
    , orderedTimeout: 60_000
    , activeTimeout: 60_000
    , concurrency: null
    , behaviorWhenAbandoned: AdditionalBehavior.None
    , behaviorWhenCompleted: AdditionalBehavior.None
    }

    await client.setQueue(queueId, config)

    expect(await client.getQueue(queueId)).toStrictEqual(config)
    expect(await client.getQueueStats(queueId)).toStrictEqual({
      drafting: 0
    , waiting: 0
    , ordered: 0
    , active: 0
    , failed: 0
    , completed: 0
    , abandoned: 0
    })
  })

  test('queue exists', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'
    const oldConfig: IQueueConfig = {
      unique: false
    , draftingTimeout: 60_000
    , orderedTimeout: 60_000
    , activeTimeout: 60_000
    , concurrency: null
    , behaviorWhenAbandoned: AdditionalBehavior.None
    , behaviorWhenCompleted: AdditionalBehavior.None
    }
    await client.setQueue(queueId, oldConfig)

    const newConfig: IQueueConfig = {
      unique: true
    , draftingTimeout: 30_000
    , orderedTimeout: 30_000
    , activeTimeout: 30_000
    , concurrency: 1
    , behaviorWhenAbandoned: AdditionalBehavior.RemoveMessage
    , behaviorWhenCompleted: AdditionalBehavior.RemoveMessage
    }
    await client.setQueue(queueId, newConfig)

    expect(await client.getQueue(queueId)).toStrictEqual(newConfig)
    expect(await client.getQueueStats(queueId)).toStrictEqual({
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
