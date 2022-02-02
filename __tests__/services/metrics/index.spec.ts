import { startService, stopService, getAddress } from '@test/utils'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'
import ms from 'ms'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService, ms('30s'))
afterEach(stopService, ms('30s'))

describe('metrics', () => {
  describe('GET /metrics', () => {
    it('200', async () => {
      const res = await fetch(get(
        url(getAddress())
      , pathname('/metrics')
      ))

      expect(res.status).toBe(200)
    })
  })
})
