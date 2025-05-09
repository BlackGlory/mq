import { beforeEach, afterEach, describe, test, expect } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { draftMessage } from '@dao/draft-message.js'
import { setMessage } from '@dao/set-message.js'
import { orderMessage } from '@dao/order-message.js'

beforeEach(startService)
afterEach(stopService)

describe('get', () => {
  test('custom priority', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const id = 'message-id'
    const type = 'text/plain'
    const priority = 1
    const payload = 'payload'
    prepareOrderedMessage(namespace, id, type, payload, priority)

    const result = await client.MQ.get(namespace, id)

    expect(result).toStrictEqual({
      type
    , priority
    , payload
    })
  })

  test('default priority', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const id = 'message-id'
    const type = 'text/plain'
    const payload = 'payload'
    prepareOrderedMessage(namespace, id, type, payload)

    const result = await client.MQ.get(namespace, id)

    expect(result).toStrictEqual({
      type
    , priority: null
    , payload
    })
  })
})

function prepareOrderedMessage(
  namespace: string
, id: string
, type: string
, payload: string
, priority?: number
): void {
  draftMessage(namespace, id, priority)
  setMessage(namespace, id, type, payload)
  orderMessage(namespace, Infinity)
}
