import { startService, stopService, getAddress } from '@test/utils.js'
import { prepareFailedMessage } from './utils.js'
import { fetch } from 'extra-fetch'
import { patch } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'
    const id = 'message-id'
    await prepareFailedMessage(namespace, id, 'text/plain', 'payload')

    const res = await fetch(patch(
      url(getAddress())
    , pathname(`/mq/${namespace}/messages/${id}/renew`)
    ))

    expect(res.status).toBe(204)
  })
})
