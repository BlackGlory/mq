import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, json } from 'extra-request/lib/es2018/transformers'
import { getRawMessage } from '@test/dao/data-in-sqlite3/mq/utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  test('no priority', async () => {
    const namespace = 'namespace'

    const res = await fetch(post(
      url(getAddress())
    , pathname(`/mq/${namespace}/messages`)
    , json({})
    ))

    expect(res.status).toBe(400)
  })

  test('priority: null', async () => {
    const namespace = 'namespace'
    const payload = { priority: null }

    const res = await fetch(post(
      url(getAddress())
    , pathname(`/mq/${namespace}/messages`)
    , json(payload)
    ))

    expect(res.status).toBe(200)
    const id = await res.text()
    const message = getRawMessage(namespace, id)
    expect(message!.priority).toBe(null)
  })

  test('priority: number', async () => {
    const namespace = 'namespace'
    const payload = { priority: 0 }

    const res = await fetch(post(
      url(getAddress())
    , pathname(`/mq/${namespace}/messages`)
    , json(payload)
    ))

    expect(res.status).toBe(200)
    const id = await res.text()
    const message = getRawMessage(namespace, id)
    expect(message!.priority).toBe(0)
  })
})
