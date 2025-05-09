import { beforeEach, afterEach, expect, test } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { draftMessage } from '@dao/draft-message.js'
import { setMessage } from '@dao/set-message.js'
import { orderMessage } from '@dao/order-message.js'
import { getMessage } from '@dao/get-message.js'
import { failMessage } from '@dao/fail-message.js'

beforeEach(startService)
afterEach(stopService)

test('getAllFailedMessageIds', async () => {
  const client = await buildClient()
  const namespace = 'namespace'
  const messageIds = ['message-id']
  prepareFailedMessages(namespace, messageIds)

  const result = await client.MQ.getAllFailedMessageIds(namespace)

  expect(result).toStrictEqual(messageIds)
})

function prepareFailedMessages(namespace: string, ids: string[]): void {
  for (const id of ids) {
    draftMessage(namespace, id)
    setMessage(namespace, id, 'type', 'payload')
    orderMessage(namespace, Infinity)
    getMessage(namespace, id)
    failMessage(namespace, id)
  }
}
