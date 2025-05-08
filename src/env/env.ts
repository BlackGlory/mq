import { ValueGetter } from 'value-getter'
import { isNumber } from '@blackglory/types'
import { Getter } from '@blackglory/prelude'
import { getCache } from '@env/cache.js'
import * as path from 'path'
import { getAppRoot } from '@src/utils.js'

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

export const NODE_ENV: Getter<NodeEnv | undefined> =
  env('NODE_ENV')
    .convert(val => {
      switch (val) {
        case 'test': return NodeEnv.Test
        case 'development': return NodeEnv.Development
        case 'production': return NodeEnv.Production
      }
    })
    .memoize(getCache)
    .get()

export const DATA: Getter<string> =
  env('MQ_DATA')
    .default(path.join(getAppRoot(), 'data'))
    .memoize(getCache)
    .get()

export const HOST: Getter<string> =
  env('MQ_HOST')
    .default('localhost')
    .memoize(getCache)
    .get()

export const PORT: Getter<number> =
  env('MQ_PORT')
    .convert(toInteger)
    .default(8080)
    .memoize(getCache)
    .get()

function env(name: string): ValueGetter<string | undefined> {
  return new ValueGetter(name, () => process.env[name])
}

function toInteger(val: string | number | undefined ): number | undefined {
  if (isNumber(val)) return val
  if (val) return Number.parseInt(val, 10)
}
