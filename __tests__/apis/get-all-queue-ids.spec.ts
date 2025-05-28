import { beforeEach, afterEach, expect, test, describe } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { AdditionalBehavior } from '@src/contract.js'

beforeEach(startService)
afterEach(stopService)

describe('getAllQueueIds', () => {
  test('empty', async () => {
    const client = await buildClient()

    const result = await client.getAllQueueIds()

    expect(result).toStrictEqual([])
  })

  test('non empty', async () => {
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

    const result = await client.getAllQueueIds()

    expect(result).toStrictEqual([queueId])
  })
})
