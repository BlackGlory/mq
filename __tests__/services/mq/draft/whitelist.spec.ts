import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { createJsonHeaders } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('200', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const mqId = 'mq-id'
        const payload = { priority: null }
        const server = await buildServer()
        await AccessControlDAO.addWhitelistItem(mqId)

        const res = await server.inject({
          method: 'POST'
        , url: `/mq/${mqId}/messages`
        , headers: createJsonHeaders()
        , payload: JSON.stringify(payload)
        })

        expect(res.statusCode).toBe(200)
      })
    })

    describe('id not in whitelist', () => {
      it('403', async () => {
        process.env.MQ_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const mqId = 'mq-id'
        const payload = { priority: null }
        const server = await buildServer()

        const res = await server.inject({
          method: 'POST'
        , url: `/mq/${mqId}/messages`
        , headers: createJsonHeaders()
        , payload: JSON.stringify(payload)
        })

        expect(res.statusCode).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('id not in whitelist', () => {
      it('200', async () => {
        const mqId = 'mq-id'
        const payload = { priority: null }
        const server = await buildServer()

        const res = await server.inject({
          method: 'POST'
        , url: `/mq/${mqId}/messages`
        , headers: createJsonHeaders()
        , payload: JSON.stringify(payload)
        })

        expect(res.statusCode).toBe(200)
      })
    })
  })
})
