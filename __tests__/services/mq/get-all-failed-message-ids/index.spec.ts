import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { startService, stopService, getAddress } from '@test/utils.js'
import { prepareFailedMessages } from './utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { toJSON } from 'extra-response'

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const namespace = 'namespace'
    const messageIds = ['message-id']
    prepareFailedMessages(namespace, messageIds)

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/mq/${namespace}/failed-messages`)
    ))

    expect(res.status).toBe(200)
    expect(await toJSON(res)).toEqual(messageIds)
  })
})
