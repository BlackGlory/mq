import { getServer } from '@test/utils'
import { startService, stopService } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('blacklist', () => {
  describe('enabled', () => {
    describe('id in blacklist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const mqId = 'mq-id'
        const server = getServer()
        await AccessControlDAO.addBlacklistItem(mqId)

        const res = await server.inject({
          method: 'GET'
        , url: `/mq/${mqId}/failed-messages`
        })

        expect(res.statusCode).toBe(403)
      })
    })

    describe('id not in blacklist', () => {
      it('200', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const mqId = 'mq-id'
        const server = getServer()

        const res = await server.inject({
          method: 'GET'
        , url: `/mq/${mqId}/failed-messages`
        })

        expect(res.statusCode).toBe(200)
      })
    })
  })

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('200', async () => {
        const mqId = 'mq-id'
        const server = getServer()

        const res = await server.inject({
          method: 'GET'
        , url: `/mq/${mqId}/failed-messages`
        })

        expect(res.statusCode).toBe(200)
      })
    })
  })
})
