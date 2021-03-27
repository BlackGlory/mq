import { ConfigurationDAO, MQDAO, SignalDAO } from '@dao'
import { DRAFTING_TIMEOUT, ORDERED_TIMEOUT, ACTIVE_TIMEOUT, THROTTLE, UNIQUE, CONCURRENCY } from '@env'
import { nanoid } from 'nanoid'
import { CustomError } from '@blackglory/errors'
import { withAbortSignal, AbortError } from 'extra-promise'
import { race, fromEvent, firstValueFrom } from 'rxjs'
import { toArrayAsync } from 'iterable-operator'

export async function draft(queueId: string, priority?: number): Promise<string> {
  const messageId = nanoid()
  await MQDAO.draftMessage(queueId, messageId, priority)
  return messageId
}

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 * @throws {DuplicatePayload}
 */
export async function set(queueId: string, messageId: string, type: string, payload: string): Promise<void> {
  const configurations = await ConfigurationDAO.getConfiguration(queueId)
  const unique = configurations.unique ?? UNIQUE()

  try {
    await MQDAO.setMessage(queueId, messageId, type, payload, unique)
    queueMicrotask(() => SignalDAO.emit(queueId))
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    if (e instanceof MQDAO.BadMessageState) throw new BadMessageState(e.message)
    if (e instanceof MQDAO.DuplicatePayload) throw new DuplicatePayload(e.message)
    throw e
  }
}

/**
 * 该函数是一个长时函数, 每个异步操作都应该可以响应AbortSignal以提前返回.
 * @throws {AbortError}
 */
export async function order(queueId: string, abortSignal: AbortSignal): Promise<string> {
  while (!abortSignal.aborted) {
    const configurations = await withAbortSignal(
      abortSignal
    , () => ConfigurationDAO.getConfiguration(queueId)
    )
    const concurrency = configurations.concurrency ?? CONCURRENCY()
    const throttle = THROTTLE()
    const duration = configurations.throttle?.duration ?? throttle.duration
    const limit = configurations.throttle?.limit ?? throttle.limit

    const messageId = await withAbortSignal(
      abortSignal
    , () => MQDAO.orderMessage(queueId, concurrency, duration, limit)
    )
    if (messageId) return messageId

    await firstValueFrom(
      // 其中一个Observable返回值时, 另一个Observable会被退订
      race(
        SignalDAO.observe(queueId) // 如果入列信号先返回, 则进入下一轮循环
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
export async function get(queueId: string, messageId: string): Promise<IMessage> {
  try {
    const message = await MQDAO.getMessage(queueId, messageId)
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
export async function abandon(queueId: string, messageId: string): Promise<void> {
  try {
    await MQDAO.abandonMessage(queueId, messageId)
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    throw e
  }
}

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export async function complete(queueId: string, messageId: string): Promise<void> {
  try {
    await MQDAO.completeMessage(queueId, messageId)
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
export async function fail(queueId: string, messageId: string): Promise<void> {
  try {
    await MQDAO.failMessage(queueId, messageId)
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
export async function renew(queueId: string, messageId: string): Promise<void> {
  try {
    await MQDAO.renewMessage(queueId, messageId)
    queueMicrotask(() => SignalDAO.emit(queueId))
  } catch (e) {
    if (e instanceof MQDAO.NotFound) throw new NotFound(e.message)
    if (e instanceof MQDAO.BadMessageState) throw new BadMessageState(e.message)
    throw e
  }
}

export async function abandonAllFailedMessages(queueId: string): Promise<void> {
  await MQDAO.abandonAllFailedMessages(queueId)
}

export async function renewAllFailedMessages(queueId: string): Promise<void> {
  await MQDAO.renewAllFailedMessages(queueId)
  queueMicrotask(() => SignalDAO.emit(queueId))
}

export async function clear(queueId: string): Promise<void> {
  await MQDAO.clear(queueId)
}

export async function stats(queueId: string): Promise<IStats> {
  return await MQDAO.stats(queueId)
}

export async function* getAllFailedMessageIds(queueId: string): AsyncIterable<string> {
  yield* MQDAO.getAllFailedMessageIds(queueId)
}

export async function* getAllQueueIds(): AsyncIterable<string> {
  yield* MQDAO.getAllQueueIds()
}

export async function maintainAllQueues(): Promise<void> {
  const ids = await toArrayAsync(MQDAO.getAllWorkingQueueIds())
  for (const id of ids) {
    await maintain(id)
  }
}

async function maintain(queueId: string): Promise<void> {
  let emit = false
  const timestamp = Date.now()

  const configurations = await ConfigurationDAO.getConfiguration(queueId)

  const draftingTimeout = configurations.draftingTimeout ?? DRAFTING_TIMEOUT()
  if (draftingTimeout !== Infinity) {
    await MQDAO.rollbackOutdatedDraftingMessages(queueId, timestamp - draftingTimeout)
  }

  const orderedTimeout = configurations.orderedTimeout ?? ORDERED_TIMEOUT()
  if (orderedTimeout !== Infinity) {
    const changed = await MQDAO.rollbackOutdatedOrderedMessages(queueId, timestamp - orderedTimeout)
    if (changed) emit = true
  }

  const activeTimeout = configurations.activeTimeout ?? ACTIVE_TIMEOUT()
  if (activeTimeout !== Infinity) {
    const changed = await MQDAO.rollbackOutdatedActiveMessages(queueId, timestamp - activeTimeout)
    if (changed) emit = true
  }

  if (emit) await SignalDAO.emit(queueId)
}

export class BadMessageState extends CustomError {}

export class NotFound extends CustomError {}

export class DuplicatePayload extends CustomError {}

export { AbortError } from 'extra-promise'
