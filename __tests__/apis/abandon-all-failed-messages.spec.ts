import { beforeEach, afterEach, test } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { draftMessage } from '@dao/draft-message.js'
import { setMessage } from '@dao/set-message.js'
import { orderMessage } from '@dao/order-message.js'
import { getMessage } from '@dao/get-message.js'
import { failMessage } from '@dao/fail-message.js'

beforeEach(startService)
afterEach(stopService)

test('abandonAllFailedMessages', async () => {
  const client = await buildClient()
  const namespace = 'namespace'
  const id = 'message-id'
  prepareFailedMessage(namespace, id, 'text/plain', 'payload')

  await client.MQ.abandonAllFailedMessages(namespace)
})

function prepareFailedMessage(
  namespace: string
, id: string
, type: string
, payload: string
): void {
  draftMessage(namespace, id)
  setMessage(namespace, id, type, payload)
  orderMessage(namespace, Infinity)
  getMessage(namespace, id)
  failMessage(namespace, id)
}
