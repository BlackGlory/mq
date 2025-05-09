import { beforeEach, afterEach, test } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { MQDAO } from '@dao/index.js'

beforeEach(startService)
afterEach(stopService)

test('abandon', async () => {
  const client = await buildClient()
  const namespace = 'namespace'
  const id = 'message-id'
  MQDAO.draftMessage(namespace, id)

  await client.MQ.abandon(namespace, id)
})
