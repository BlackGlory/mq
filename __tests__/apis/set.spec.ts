import { beforeEach, afterEach, test } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { draftMessage } from '@dao/draft-message.js'

beforeEach(startService)
afterEach(stopService)

test('set', async () => {
  const client = await buildClient()
  const namespace = 'namespace'
  const id = 'message-id'
  const payload = 'payload'
  prepareDraftingMessage(namespace, id)

  await client.MQ.set(namespace, id, 'text/plain', payload)
})

function prepareDraftingMessage(namespace: string, id: string): void {
  draftMessage(namespace, id)
}
