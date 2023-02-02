import { startService, stopService, getAddress } from '@test/utils.js'
import { prepareWaitingMessage } from './utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { api } from '@src/api/index.js'
import { delay } from 'extra-promise'

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const namespace = 'namespace'
    const id = 'message-id'
    await prepareWaitingMessage(namespace, id, 'text/plain', 'payload')

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/mq/${namespace}/messages`)
    ))

    expect(res.status).toBe(200)
  })

  it('can abort by clear', async () => {
    const namespace = 'namespace'
    queueMicrotask(async () => {
      await delay(1000)
      api.MQ.clear(namespace)
    })

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/mq/${namespace}/messages`)
    ))

    expect(res.status).toBe(404)
  })
})
