import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, json } from 'extra-request/transformers'
import { getRawMessage } from '@test/dao/data/mq/utils.js'

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
