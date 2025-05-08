import { beforeEach, afterEach, describe, it, expect } from 'vitest'
import { startService, stopService, getAddress } from '@test/utils.js'
import { MQDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'
    const id = 'message-id'
    MQDAO.draftMessage(namespace, id)

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/mq/${namespace}/messages/${id}`)
    ))

    expect(res.status).toBe(204)
  })
})
