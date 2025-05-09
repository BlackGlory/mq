import { beforeEach, afterEach, test } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { draftMessage } from '@dao/draft-message.js'
import { setMessage } from '@dao/set-message.js'
import { orderMessage } from '@dao/order-message.js'
import { getMessage } from '@dao/get-message.js'

beforeEach(startService)
afterEach(stopService)

test('fail', async () => {
  const client = await buildClient()
  const namespace = 'namespace'
  const id = 'message-id'
  prepareActiveMessage(namespace, id, 'text/plain', 'payload')

  await client.MQ.fail(namespace, id)
})

function prepareActiveMessage(
  namespace: string
, id: string
, type: string
, payload: string
): void {
  draftMessage(namespace, id)
  setMessage(namespace, id, type, payload)
  orderMessage(namespace, Infinity)
  getMessage(namespace, id)
}
