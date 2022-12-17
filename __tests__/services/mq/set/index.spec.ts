import { startService, stopService, getAddress } from '@test/utils'
import { prepareDraftingMessage } from './utils'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, json } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'
    const id = 'message-id'
    const payload = 'payload'
    await prepareDraftingMessage(namespace, id)

    const res = await fetch(put(
      url(getAddress())
    , pathname(`/mq/${namespace}/messages/${id}`)
    , json(payload)
    ))

    expect(res.status).toBe(204)
  })
})
