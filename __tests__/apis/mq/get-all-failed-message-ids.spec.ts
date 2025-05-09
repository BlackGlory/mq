import { beforeEach, afterEach, expect, test } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { MQDAO } from '@dao/index.js'

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
    MQDAO.draftMessage(namespace, id)
    MQDAO.setMessage(namespace, id, 'type', 'payload')
    MQDAO.orderMessage(namespace, Infinity)
    MQDAO.getMessage(namespace, id)
    MQDAO.failMessage(namespace, id)
  }
}
