import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, json } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const mqId = 'mq-id'
    const payload = { priority: null }

    const res = await fetch(post(
      url(getAddress())
    , pathname(`/mq/${mqId}/messages`)
    , json(payload)
    ))

    expect(res.status).toBe(200)
  })
})
