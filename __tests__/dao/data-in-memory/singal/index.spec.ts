import { SignalDAO } from '@src/dao/data-in-memory/signal'
import { Observable, firstValueFrom } from 'rxjs'
import '@blackglory/jest-matchers'

const TIME_ERROR = 1

describe('SignalDAO', () => {
  it('observe, emit', async () => {
    const key = 'key'

    const start = getTimestamp()
    setTimeout(() => SignalDAO.emit(key), 1000)
    const result = SignalDAO.observe(key)
    const proResult = await firstValueFrom(result)
    const elapsed = getTimestamp() - start

    expect(result).toBeInstanceOf(Observable)
    expect(proResult).toBeNull()
    expect(elapsed).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
  })
})

function getTimestamp(): number {
  return Date.now()
}
