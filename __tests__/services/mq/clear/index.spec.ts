import { startService, stopService, getAddress } from '@test/utils'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/mq/${namespace}`)
    ))

    expect(res.status).toBe(204)
  })
})
