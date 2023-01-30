import { NODE_ENV, NodeEnv } from '@env/index.js'
import { isntUndefined } from '@blackglory/prelude'

let mockTimestamp: number | undefined = undefined
export function setMockTimestamp(timestamp: number): void {
  mockTimestamp = timestamp
}

export function clearMock(): void {
  mockTimestamp = undefined
}

export function getTimestamp(): number {
  if (NODE_ENV() === NodeEnv.Test && isntUndefined(mockTimestamp)) {
    return mockTimestamp
  } else {
    return Date.now()
  }
}
