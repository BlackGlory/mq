import { strict as assert } from 'assert'
import { memoize } from 'lodash'

export enum ListBasedAccessControl {
  Disable
, Whitelist
, Blacklist
}

export enum NodeEnv {
  Test
, Development
, Production
}

export const NODE_ENV = memoize(function (): NodeEnv | undefined {
  switch (process.env.NODE_ENV) {
    case 'test': return NodeEnv.Test
    case 'development': return NodeEnv.Development
    case 'production': return NodeEnv.Production
  }
})

export const PORT = memoize(function (): number {
  if (process.env.MQ_PORT) {
    return Number.parseInt(process.env.MQ_PORT, 10)
  } else {
    return 8080
  }
})

export const HOST = memoize(function (): string {
  return process.env.MQ_HOST || 'localhost'
})

export const ADMIN_PASSWORD = memoize(function (): string | undefined {
  return process.env.MQ_ADMIN_PASSWORD
})

export const LIST_BASED_ACCESS_CONTROL = memoize(function (): ListBasedAccessControl {
  switch (process.env.MQ_LIST_BASED_ACCESS_CONTROL) {
    case 'whitelist': return ListBasedAccessControl.Whitelist
    case 'blacklist': return ListBasedAccessControl.Blacklist
    default: return ListBasedAccessControl.Disable
  }
})

export const TOKEN_BASED_ACCESS_CONTROL = memoize(function (): boolean {
  return process.env.MQ_TOKEN_BASED_ACCESS_CONTROL === 'true'
})

export const PRODUCE_TOKEN_REQUIRED = memoize(function (): boolean {
  return process.env.MQ_PRODUCE_TOKEN_REQUIRED === 'true'
})

export const CONSUME_TOKEN_REQUIRED = memoize(function (): boolean {
  return process.env.MQ_CONSUME_TOKEN_REQUIRED === 'true'
})

export const CLEAR_TOKEN_REQUIRED = memoize(function (): boolean {
  return process.env.MQ_CLEAR_TOKEN_REQUIRED === 'true'
})

export const HTTP2 = memoize(function (): boolean {
  return process.env.MQ_HTTP2 === 'true'
})

export const JSON_VALIDATION = memoize(function (): boolean {
  return process.env.MQ_JSON_VALIDATION === 'true'
})

export const JSON_PAYLOAD_ONLY = memoize(function (): boolean {
  return process.env.MQ_JSON_PAYLOAD_ONLY === 'true'
})

export const DEFAULT_JSON_SCHEMA = memoize(function (): string | undefined {
  return process.env.MQ_DEFAULT_JSON_SCHEMA
})

export const CI = memoize(function (): boolean {
  return process.env.CI === 'true'
})

export const PAYLOAD_LIMIT = memoize(function (): number {
  if (process.env.MQ_PAYLOAD_LIMIT) {
    const val = Number.parseInt(process.env.MQ_PAYLOAD_LIMIT, 10)
    assert(val > 0)
    return val
  } else {
    return 1048576
  }
})

export const SET_PAYLOAD_LIMIT = memoize(function (): number {
  if (process.env.MQ_SET_PAYLOAD_LIMIT) {
    const val = Number.parseInt(process.env.MQ_SET_PAYLOAD_LIMIT, 10)
    assert(val > 0)
    return val
  } else {
    return PAYLOAD_LIMIT()
  }
})

export const UNIQUE = memoize(function (): boolean {
  return process.env.MQ_UNIQUE === 'true'
})

export const DRAFTING_TIMEOUT = memoize(function (): number {
  if (process.env.MQ_DRAFTING_TIMEOUT) {
    const val = Number.parseInt(process.env.MQ_DRAFTING_TIMEOUT, 10)
    assert(val > 0)
    return val
  } else {
    return 600
  }
})

export const ORDERED_TIMEOUT = memoize(function (): number {
  if (process.env.MQ_ORDERED_TIMEOUT) {
    const val = Number.parseInt(process.env.MQ_ORDERED_TIMEOUT, 10)
    assert(val > 0)
    return val
  } else {
    return 600
  }
})

export const ACTIVE_TIMEOUT = memoize(function (): number {
  if (process.env.MQ_ACTIVE_TIMEOUT) {
    const val = Number.parseInt(process.env.MQ_ACTIVE_TIMEOUT, 10)
    assert(val > 0)
    return val
  } else {
    return Infinity
  }
})

export const THROTTLE = memoize(function (): Throttle {
  if (process.env.MQ_THROTTLE) {
    const throttle = JSON.parse(process.env.MQ_THROTTLE) as Throttle
    assert(Number.isInteger(throttle.duration))
    assert(throttle.duration > 0)
    assert(Number.isInteger(throttle.limit))
    assert(throttle.limit > 0)
    return throttle
  } else {
    return {
      duration: Infinity
    , limit: Infinity
    }
  }
})
