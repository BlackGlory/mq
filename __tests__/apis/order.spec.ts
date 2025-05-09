import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { startService, stopService, buildClient } from '@test/utils.js'
import { delay } from 'extra-promise'
import { getErrorAsync } from 'return-style'
import { AbortError } from 'extra-abort'
import { draftMessage } from '@dao/draft-message.js'
import { setMessage } from '@dao/set-message.js'

beforeEach(startService)
afterEach(stopService)

describe('order', () => {
  it('general', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const id = 'message-id'
    prepareWaitingMessage(namespace, id, 'text/plain', 'payload')

    await client.MQ.order(namespace, new AbortController().signal)
  })

  it('can abort by clear', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    queueMicrotask(async () => {
      await delay(1000)
      await client.MQ.clear(namespace)
    })

    const err = await getErrorAsync(() => client.MQ.order(namespace, new AbortController().signal))

    expect(err).toBeInstanceOf(AbortError)
  })
})

function prepareWaitingMessage(
  namespace: string
, id: string
, type: string
, payload: string
): void {
  draftMessage(namespace, id)
  setMessage(namespace, id, type, payload)
}
