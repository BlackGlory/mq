import { NODE_ENV, NodeEnv } from '@env/index.js'
import { isntUndefined } from '@blackglory/prelude'

let mockedTimestamp: number | undefined = undefined
export function _setMockedTimestamp(timestamp: number): void {
  mockedTimestamp = timestamp
}

export function _clearMockedTimestamp(): void {
  mockedTimestamp = undefined
}

export const getTimestamp: () => number =
  NODE_ENV() === NodeEnv.Test
? (): number => {
    if (isntUndefined(mockedTimestamp)) {
      return mockedTimestamp
    } else {
      return _getTimestamp()
    }
  }
: _getTimestamp

function _getTimestamp(): number {
  return Date.now()
}
