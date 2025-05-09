import { beforeEach, afterEach, describe, test, expect } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { getRawMessage } from '@test/dao/utils.js'

beforeEach(startService)
afterEach(stopService)

describe('draft', () => {
  test('priority: null', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const priority = null

    const id = await client.MQ.draft(namespace, priority)

    const message = getRawMessage(namespace, id)
    expect(message!.priority).toBe(null)
  })

  test('priority: number', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const priority = 0

    const id = await client.MQ.draft(namespace, priority)

    const message = getRawMessage(namespace, id)
    expect(message!.priority).toBe(0)
  })
})
