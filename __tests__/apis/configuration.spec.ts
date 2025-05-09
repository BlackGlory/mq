import { beforeEach, afterEach, describe, test } from 'vitest'
import { expectMatchSchema, startService, stopService, buildClient } from '@test/utils.js'

beforeEach(startService)
afterEach(stopService)

describe('Configuration', () => {
  test('getAllNamespaces', async () => {
    const client = await buildClient()

    const result = await client.Configuration.getAllNamespaces()

    expectMatchSchema(result, {
      type: 'array'
    , items: { type: 'string' }
    })
  })

  test('get', async () => {
    const client = await buildClient()
    const namespace = 'namespace'

    const result = await client.Configuration.get(namespace)

    expectMatchSchema(result, {
      type: 'object'
    , properties: {
        unique: {
          oneOf: [
            { type: 'boolean' }
          , { type: 'null' }
          ]
        }
      , draftingTimeout: {
          oneOf: [
            { type: 'number' }
          , { type: 'null' }
          ]
        }
      , orderedTimeout: {
          oneOf: [
            { type: 'number' }
          , { type: 'null' }
          ]
        }
      , activeTimeout: {
          oneOf: [
            { type: 'number' }
          , { type: 'null' }
          ]
        }
      , concurrency: {
          oneOf: [
            { type: 'number' }
          , { type: 'null' }
          ]
        }
      }
    })
  })

  test('setUnique', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const val = true

    await client.Configuration.setUnique(namespace, val)
  })

  test('unsetUnqiue', async () => {
    const client = await buildClient()
    const namespace = 'namespace'

    await client.Configuration.unsetUnique(namespace)
  })

  test('setDraftingTimeout', async () => {
    const client = await buildClient()

    const namespace = 'namespace'
    const val = 100

    await client.Configuration.setDraftingTimeout(namespace, val)
  })

  test('unsetDraftingTimeout', async () => {
    const client = await buildClient()
    const namespace = 'namespace'

    await client.Configuration.unsetDraftingTimeout(namespace)
  })

  test('setOrderedTimeout', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const val = 100

    await client.Configuration.setOrderedTimeout(namespace, val)
  })

  test('unsetOrderedTimeout', async () => {
    const client = await buildClient()
    const namespace = 'namespace'

    await client.Configuration.unsetOrderedTimeout(namespace)
  })

  test('setActiveTimeout', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const val = 100

    await client.Configuration.setActiveTimeout(namespace, val)
  })

  test('unsetActiveTimeout', async () => {
    const client = await buildClient()
    const namespace = 'namespace'

    await client.Configuration.unsetActiveTimeout(namespace)
  })

  test('setConcurrency', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const val = 100

    await client.Configuration.setConcurrency(namespace, val)
  })

  test('unsetConcurrency', async () => {
    const client = await buildClient()
    const namespace = 'namespace'

    await client.Configuration.unsetConcurrency(namespace)
  })
})
