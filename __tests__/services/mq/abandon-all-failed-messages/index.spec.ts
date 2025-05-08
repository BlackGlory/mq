import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { startService, stopService, getAddress } from '@test/utils.js'
import { prepareFailedMessage } from './utils.js'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'
    const id = 'message-id'
    prepareFailedMessage(namespace, id, 'text/plain', 'payload')

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/mq/${namespace}/failed-messages`)
    ))

    expect(res.status).toBe(204)
  })
})
