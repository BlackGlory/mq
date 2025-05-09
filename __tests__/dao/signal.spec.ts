import { test, expect } from 'vitest'
import { observe, emit } from '@dao/signal.js'
import { Observable, firstValueFrom } from 'rxjs'

const TIME_ERROR = 1

test('observe, emit', async () => {
  const namespace = 'namespace'

  const start = getTimestamp()
  setTimeout(() => emit(namespace), 1000)
  const result = observe(namespace)
  const proResult = await firstValueFrom(result)
  const elapsed = getTimestamp() - start

  expect(result).toBeInstanceOf(Observable)
  expect(proResult).toBeUndefined()
  expect(elapsed).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
})

function getTimestamp(): number {
  return Date.now()
}
