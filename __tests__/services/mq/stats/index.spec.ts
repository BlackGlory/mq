import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const namespace = 'namespace'

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/mq/${namespace}/stats`)
    ))

    expect(res.status).toBe(200)
  })
})
