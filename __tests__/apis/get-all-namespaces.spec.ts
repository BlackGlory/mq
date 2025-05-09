import { beforeEach, afterEach, expect, test } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { draftMessage } from '@dao/draft-message.js'

beforeEach(startService)
afterEach(stopService)

test('getAllNamespaces', async () => {
  const client = await buildClient()
  const namespaces = ['namespace']
  prepareNamespaces(namespaces)

  const result = await client.MQ.getAllNamespaces()

  expect(result).toStrictEqual(namespaces)
})

function prepareNamespaces(namespaces: string[]): void {
  for (const namespace of namespaces) {
    draftMessage(namespace, 'message-id')
  }
}
