import { ConfigurationDAO, MQDAO, SignalDAO } from '@dao'
import { DRAFTING_TIMEOUT, ORDERED_TIMEOUT, ACTIVE_TIMEOUT, UNIQUE, CONCURRENCY } from '@env'
import { nanoid } from 'nanoid'
import { CustomError } from '@blackglory/errors'
import { AbortError } from 'extra-abort'
import { race, fromEvent, firstValueFrom } from 'rxjs'
import { toArrayAsync } from 'iterable-operator'

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

export async function draft(namespace: string, priority?: number): Promise<string> {
  const messageId = nanoid()
  await MQDAO.draftMessage(namespace, messageId, priority)
  return messageId
}

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 * @throws {DuplicatePayload}
 */
export async function set(
  namespace: string
, id: string
, type: string
, payload: string
): Promise<void> {
  const configurations = await ConfigurationDAO.getConfiguration(namespace)
  const unique = configurations.unique ?? UNIQUE()

  try {
    await MQDAO.setMessage(namespace, id, type, payload, unique)
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
export async function order(namespace: string, abortSignal: AbortSignal): Promise<string> {
  while (!abortSignal.aborted) {
    const configurations = await ConfigurationDAO.getConfiguration(namespace)
    const concurrency = configurations.concurrency ?? CONCURRENCY()

    const id = await MQDAO.orderMessage(namespace, concurrency)
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
export async function get(namespace: string, id: string): Promise<IMessage> {
  try {
    const message = await MQDAO.getMessage(namespace, id)
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
export async function abandon(namespace: string, id: string): Promise<void> {
  try {
    await MQDAO.abandonMessage(namespace, id)
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    throw e
  }
}

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export async function complete(namespace: string, id: string): Promise<void> {
  try {
    await MQDAO.completeMessage(namespace, id)
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
export async function fail(namespace: string, id: string): Promise<void> {
  try {
    await MQDAO.failMessage(namespace, id)
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
export async function renew(namespace: string, id: string): Promise<void> {
  try {
    await MQDAO.renewMessage(namespace, id)
    queueMicrotask(() => SignalDAO.emit(namespace))
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    if (e instanceof MQDAO.BadMessageState) throw new BadMessageState(e.message)
    throw e
  }
}

export async function abandonAllFailedMessages(namespace: string): Promise<void> {
  await MQDAO.abandonAllFailedMessages(namespace)
}

export async function renewAllFailedMessages(namespace: string): Promise<void> {
  await MQDAO.renewAllFailedMessages(namespace)
  queueMicrotask(() => SignalDAO.emit(namespace))
}

export async function clear(namespace: string): Promise<void> {
  await MQDAO.clear(namespace)
  PendingOrderControllerRegistry.abortAll(namespace)
}

export async function stats(namespace: string): Promise<IStats> {
  return await MQDAO.stats(namespace)
}

export async function* getAllFailedMessageIds(namespace: string): AsyncIterable<string> {
  yield* MQDAO.getAllFailedMessageIds(namespace)
}

export async function* getAllNamespaces(): AsyncIterable<string> {
  yield* MQDAO.getAllNamespaces()
}

export async function nextTick(): Promise<void> {
  const ids = await toArrayAsync(MQDAO.getAllWorkingNamespaces())
  for (const id of ids) {
    await nextTick(id)
  }

  async function nextTick(namespace: string): Promise<void> {
    let emit = false
    const timestamp = Date.now()

    const configurations = await ConfigurationDAO.getConfiguration(namespace)

    const draftingTimeout = configurations.draftingTimeout ?? DRAFTING_TIMEOUT()
    if (draftingTimeout !== Infinity) {
      await MQDAO.rollbackOutdatedDraftingMessages(namespace, timestamp - draftingTimeout)
    }

    const orderedTimeout = configurations.orderedTimeout ?? ORDERED_TIMEOUT()
    if (orderedTimeout !== Infinity) {
      const changed = await MQDAO.rollbackOutdatedOrderedMessages(namespace, timestamp - orderedTimeout)
      if (changed) emit = true
    }

    const activeTimeout = configurations.activeTimeout ?? ACTIVE_TIMEOUT()
    if (activeTimeout !== Infinity) {
      const changed = await MQDAO.rollbackOutdatedActiveMessages(namespace, timestamp - activeTimeout)
      if (changed) emit = true
    }

    if (emit) SignalDAO.emit(namespace)
  }
}

export class BadMessageState extends CustomError {}
export class NotFound extends CustomError {}
export class DuplicatePayload extends CustomError {}
export { AbortError } from 'extra-abort'
