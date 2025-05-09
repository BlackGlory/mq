import { beforeEach, afterEach, test } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { MQDAO } from '@dao/index.js'

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
  MQDAO.draftMessage(namespace, id)
  MQDAO.setMessage(namespace, id, type, payload)
  MQDAO.orderMessage(namespace, Infinity)
  MQDAO.getMessage(namespace, id)
}
