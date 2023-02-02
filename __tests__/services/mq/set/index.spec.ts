import { startService, stopService, getAddress } from '@test/utils.js'
import { prepareDraftingMessage } from './utils.js'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, json } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'
    const id = 'message-id'
    const payload = 'payload'
    prepareDraftingMessage(namespace, id)

    const res = await fetch(put(
      url(getAddress())
    , pathname(`/mq/${namespace}/messages/${id}`)
    , json(payload)
    ))

    expect(res.status).toBe(204)
  })
})
