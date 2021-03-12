import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { prepareDraftingMessage } from './utils'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, json } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const mqId = 'mq-id'
    const messageId = 'message-id'
    const payload = 'payload'
    await prepareDraftingMessage(mqId, messageId)

    const res = await fetch(put(
      url(getAddress())
    , pathname(`/mq/${mqId}/messages/${messageId}`)
    , json(payload)
    ))

    expect(res.status).toBe(204)
  })
})
