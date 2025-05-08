import { describe, it, expect } from 'vitest'
import { SignalDAO } from '@src/dao/data/signal/index.js'
import { Observable, firstValueFrom } from 'rxjs'

const TIME_ERROR = 1

describe('SignalDAO', () => {
  it('observe, emit', async () => {
    const namespace = 'namespace'

    const start = getTimestamp()
    setTimeout(() => SignalDAO.emit(namespace), 1000)
    const result = SignalDAO.observe(namespace)
    const proResult = await firstValueFrom(result)
    const elapsed = getTimestamp() - start

    expect(result).toBeInstanceOf(Observable)
    expect(proResult).toBeUndefined()
    expect(elapsed).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
  })
})

function getTimestamp(): number {
  return Date.now()
}
