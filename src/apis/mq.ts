import { ConfigurationDAO, MQDAO, SignalDAO } from '@dao/index.js'
import { nanoid } from 'nanoid'
import { AbortError } from 'extra-abort'
import { race, fromEvent, firstValueFrom } from 'rxjs'
import { toArray } from 'iterable-operator'
import { BadMessageState, DuplicatePayload, IMessage, IStats, NotFound } from '@src/contract.js'

export class PendingOrderControllerRegistry {
  private static controllers: Map<string, Set<AbortController>> = new Map()

  static register(namespace: string, controller: AbortController): null {
    if (!this.controllers.has(namespace)) {
      this.controllers.set(namespace, new Set())
    }
    this.controllers.get(namespace)!.add(controller)

    return null
  }

  static unregister(namespace: string, controller: AbortController): null {
    this.controllers.get(namespace)?.delete(controller)

    return null
  }

  static abortAll(namespace: string): null {
    this.controllers.get(namespace)?.forEach(controller => controller.abort())
    this.controllers.set(namespace, new Set())

    return null
  }
}

export function draft(namespace: string, priority: number | null): string {
  const messageId = nanoid()
  MQDAO.draftMessage(namespace, messageId, priority ?? undefined)
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
): null {
  const configurations = ConfigurationDAO.getConfiguration(namespace)
  const unique = configurations.unique ?? false

  try {
    MQDAO.setMessage(namespace, id, type, payload, unique)
    queueMicrotask(() => SignalDAO.emit(namespace))

    return null
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    if (e instanceof MQDAO.BadMessageState) throw new BadMessageState(e.message)
    if (e instanceof MQDAO.DuplicatePayload) throw new DuplicatePayload(e.message)
    throw e
  }
}

export async function order(namespace: string, signal?: AbortSignal): Promise<string> {
  const controller = new AbortController()

  signal?.addEventListener('abort', () => {
    controller.abort()
    PendingOrderControllerRegistry.unregister(namespace, controller)
  })

  try {
    PendingOrderControllerRegistry.register(namespace, controller)
    const result = await _order(namespace, controller.signal)
    return result
  } finally {
    PendingOrderControllerRegistry.unregister(namespace, controller)
  }
}

/**
 * @throws {AbortError}
 */
async function _order(
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
export function abandon(namespace: string, id: string): null {
  try {
    MQDAO.abandonMessage(namespace, id)

    return null
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    throw e
  }
}

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export function complete(namespace: string, id: string): null {
  try {
    MQDAO.completeMessage(namespace, id)

    return null
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
export function fail(namespace: string, id: string): null {
  try {
    MQDAO.failMessage(namespace, id)

    return null
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
export function renew(namespace: string, id: string): null {
  try {
    MQDAO.renewMessage(namespace, id)
    queueMicrotask(() => SignalDAO.emit(namespace))

    return null
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    if (e instanceof MQDAO.BadMessageState) throw new BadMessageState(e.message)
    throw e
  }
}

export function abandonAllFailedMessages(namespace: string): null {
  MQDAO.abandonAllFailedMessages(namespace)

  return null
}

export function renewAllFailedMessages(namespace: string): null {
  MQDAO.renewAllFailedMessages(namespace)
  queueMicrotask(() => SignalDAO.emit(namespace))

  return null
}

export function clear(namespace: string): null {
  MQDAO.clear(namespace)
  PendingOrderControllerRegistry.abortAll(namespace)

  return null
}

export function stats(namespace: string): IStats {
  return MQDAO.stats(namespace)
}

export function getAllFailedMessageIds(namespace: string): string[] {
  return toArray(MQDAO.getAllFailedMessageIds(namespace))
}

export function getAllNamespaces(): string[] {
  return toArray(MQDAO.getAllNamespaces())
}

export function nextTick(): null {
  const ids = toArray(MQDAO.getAllWorkingNamespaces())
  for (const id of ids) {
    nextTick(id)
  }

  return null

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
