import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { prepareFailedMessage } from './utils'
import { fetch } from 'extra-fetch'
import { patch } from 'extra-request'
import { url, pathname, searchParam } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const mqId = 'mq-id'
    const messageId = 'message-id'
    await prepareFailedMessage(mqId, messageId, 'text/plain', 'payload')

    const res = await fetch(patch(
      url(getAddress())
    , pathname(`/mq/${mqId}/failed-messages/renew`)
    ))

    expect(res.status).toBe(204)
  })
})
