import { beforeEach, afterEach, expect, test, describe } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior, IQueueConfig } from '@src/contract.js'

beforeEach(startService)
afterEach(stopService)

describe('removeQueue', () => {
  test('queue does not exist', async () => {
    const client = await buildClient()
    const queueId = 'queue-id'

    await client.removeQueue(queueId)

    expect(await client.getQueue(queueId)).toBe(null)
  })

  test('queue exists', async () => {
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

    const result = await client.getQueue(queueId)

    expect(result).toStrictEqual(config)
  })
})
