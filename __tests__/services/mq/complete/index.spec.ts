import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { prepareActiveMessage } from './utils'
import { fetch } from 'extra-fetch'
import { patch } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'
    const id = 'message-id'
    await prepareActiveMessage(namespace, id, 'text/plain', 'payload')

    const res = await fetch(patch(
      url(getAddress())
    , pathname(`/mq/${namespace}/messages/${id}/complete`)
    ))

    expect(res.status).toBe(204)
  })
})
