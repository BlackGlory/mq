import { SignalDAO } from '@src/dao/data-in-memory/signal'
import '@blackglory/jest-matchers'

const TIME_ERROR = 1

describe('SignalDAO', () => {
  it('wait, emit', async () => {
    const key = 'key'

    const start = getTimestamp()
    setTimeout(() => SignalDAO.emit(key), 1000)
    const result = SignalDAO.wait(key)
    const proResult = await result
    const elapsed = getTimestamp() - start

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
    expect(elapsed).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
  })
})

function getTimestamp(): number {
  return Date.now()
}
