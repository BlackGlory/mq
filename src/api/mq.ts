import { ConfigurationDAO, MQDAO, SignalDAO } from '@dao/index.js'
import { nanoid } from 'nanoid'
import { CustomError } from '@blackglory/errors'
import { AbortError } from 'extra-abort'
import { race, fromEvent, firstValueFrom } from 'rxjs'
import { toArray } from 'iterable-operator'
import { IMessage, IStats } from './contract.js'

export class PendingOrderControllerRegistry {
  private static controllers: Map<string, Set<AbortController>> = new Map()

  static register(namespace: string, controller: AbortController): void {
    if (!this.controllers.has(namespace)) {
      this.controllers.set(namespace, new Set())
    }
    this.controllers.get(namespace)!.add(controller)
  }

  static unregister(namespace: string, controller: AbortController): void {
    this.controllers.get(namespace)?.delete(controller)
  }

  static abortAll(namespace: string): void {
    this.controllers.get(namespace)?.forEach(controller => controller.abort())
    this.controllers.set(namespace, new Set())
  }
}

export function draft(namespace: string, priority?: number): string {
  const messageId = nanoid()
  MQDAO.draftMessage(namespace, messageId, priority)
  return messageId
}

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 * @throws {DuplicatePayload}
 */
export function set(
  namespace: string
, id: string
, type: string
, payload: string
): void {
  const configurations = ConfigurationDAO.getConfiguration(namespace)
  const unique = configurations.unique ?? false

  try {
    MQDAO.setMessage(namespace, id, type, payload, unique)
    queueMicrotask(() => SignalDAO.emit(namespace))
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    if (e instanceof MQDAO.BadMessageState) throw new BadMessageState(e.message)
    if (e instanceof MQDAO.DuplicatePayload) throw new DuplicatePayload(e.message)
    throw e
  }
}

/**
 * @throws {AbortError}
 */
export async function order(
  namespace: string
, abortSignal: AbortSignal
): Promise<string> {
  while (!abortSignal.aborted) {
    const configurations = ConfigurationDAO.getConfiguration(namespace)
    const concurrency = configurations.concurrency ?? Infinity

    const id = MQDAO.orderMessage(namespace, concurrency)
    if (id) return id

    await firstValueFrom(
      // 其中一个Observable返回值时, 另一个Observable会被退订
      race(
        SignalDAO.observe(namespace) // 如果信号先返回, 则进入下一轮循环
      , fromEvent(abortSignal, 'abort') // 如果中断信号先返回, 则中断循环
      )
    )
  }
  throw new AbortError()
}

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export function get(namespace: string, id: string): IMessage {
  try {
    const message = MQDAO.getMessage(namespace, id)
    return message
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    if (e instanceof MQDAO.BadMessageState) throw new BadMessageState(e.message)
    throw e
  }
}

/**
 * @throws {NotFound}
 */
export function abandon(namespace: string, id: string): void {
  try {
    MQDAO.abandonMessage(namespace, id)
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    throw e
  }
}

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export function complete(namespace: string, id: string): void {
  try {
    MQDAO.completeMessage(namespace, id)
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    if (e instanceof MQDAO.BadMessageState) throw new BadMessageState(e.message)
    throw e
  }
}

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export function fail(namespace: string, id: string): void {
  try {
    MQDAO.failMessage(namespace, id)
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    if (e instanceof MQDAO.BadMessageState) throw new BadMessageState(e.message)
    throw e
  }
}

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export function renew(namespace: string, id: string): void {
  try {
    MQDAO.renewMessage(namespace, id)
    queueMicrotask(() => SignalDAO.emit(namespace))
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    if (e instanceof MQDAO.BadMessageState) throw new BadMessageState(e.message)
    throw e
  }
}

export function abandonAllFailedMessages(namespace: string): void {
  MQDAO.abandonAllFailedMessages(namespace)
}

export function renewAllFailedMessages(namespace: string): void {
  MQDAO.renewAllFailedMessages(namespace)
  queueMicrotask(() => SignalDAO.emit(namespace))
}

export function clear(namespace: string): void {
  MQDAO.clear(namespace)
  PendingOrderControllerRegistry.abortAll(namespace)
}

export function stats(namespace: string): IStats {
  return MQDAO.stats(namespace)
}

export function* getAllFailedMessageIds(namespace: string): Iterable<string> {
  yield* MQDAO.getAllFailedMessageIds(namespace)
}

export function* getAllNamespaces(): Iterable<string> {
  yield* MQDAO.getAllNamespaces()
}

export function nextTick(): void {
  const ids = toArray(MQDAO.getAllWorkingNamespaces())
  for (const id of ids) {
    nextTick(id)
  }

  function nextTick(namespace: string): void {
    let emit = false
    const timestamp = Date.now()

    const configurations = ConfigurationDAO.getConfiguration(namespace)

    const draftingTimeout = configurations.draftingTimeout ?? 60_000
    if (draftingTimeout !== Infinity) {
      MQDAO.rollbackOutdatedDraftingMessages(namespace, timestamp - draftingTimeout)
    }

    const orderedTimeout = configurations.orderedTimeout ?? 60_000
    if (orderedTimeout !== Infinity) {
      const changed = MQDAO.rollbackOutdatedOrderedMessages(namespace, timestamp - orderedTimeout)
      if (changed) emit = true
    }

    const activeTimeout = configurations.activeTimeout ??  300_000
    if (activeTimeout !== Infinity) {
      const changed = MQDAO.rollbackOutdatedActiveMessages(namespace, timestamp - activeTimeout)
      if (changed) emit = true
    }

    if (emit) SignalDAO.emit(namespace)
  }
}

export class BadMessageState extends CustomError {}
export class NotFound extends CustomError {}
export class DuplicatePayload extends CustomError {}
export { AbortError } from 'extra-abort'
