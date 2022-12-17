import { startService, stopService, getAddress } from '@test/utils'
import { prepareFailedMessage } from './utils'
import { fetch } from 'extra-fetch'
import { patch } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

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
