import { beforeEach, afterEach, test } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'

beforeEach(startService)
afterEach(stopService)

test('stats', async () => {
  const client = await buildClient()
  const namespace = 'namespace'

  await client.MQ.stats(namespace)
})
