import { beforeEach, afterEach, test } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { MQDAO } from '@dao/index.js'

beforeEach(startService)
afterEach(stopService)

test('renew', async () => {
  const client = await buildClient()
  const namespace = 'namespace'
  const id = 'message-id'
  prepareFailedMessage(namespace, id, 'text/plain', 'payload')

  await client.MQ.renew(namespace, id)
})

function prepareFailedMessage(
  namespace: string
, id: string
, type: string
, payload: string
): void {
  MQDAO.draftMessage(namespace, id)
  MQDAO.setMessage(namespace, id, type, payload)
  MQDAO.orderMessage(namespace, Infinity)
  MQDAO.getMessage(namespace, id)
  MQDAO.failMessage(namespace, id)
}
