import { ConfigurationDAO, MQDAO, SignalDAO } from '@dao'
import { DRAFTING_TIMEOUT, ORDERED_TIMEOUT, ACTIVE_TIMEOUT, THROTTLE, UNIQUE, CONCURRENCY } from '@env'
import { nanoid } from 'nanoid'
import { CustomError } from '@blackglory/errors'
import { delay } from 'extra-promise'

export function autoMaintain(abortSignal: AbortSignal): void {
  ;(async () => {
    while (!abortSignal.aborted) {
      await maintainAllQueues()
      await delay(1_000)
    }
  })()
}

export async function draft(queueId: string, priority?: number): Promise<string> {
  await maintain(queueId)

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
  await maintain(queueId)

  const configurations = await ConfigurationDAO.getConfigurations(queueId)
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

export async function order(queueId: string): Promise<string> {
  while (true) {
    await maintain(queueId)

    const configurations = await ConfigurationDAO.getConfigurations(queueId)
    const concurrency = configurations.concurrency ?? CONCURRENCY()
    const throttle = THROTTLE()
    const duration = configurations.throttle?.duration ?? throttle.duration
    const limit = configurations.throttle?.limit ?? throttle.limit

    const messageId = await MQDAO.orderMessage(queueId, concurrency, duration, limit)
    if (messageId) return messageId

    await SignalDAO.wait(queueId)
  }
}

/**
 * @throws {NotFound}
 * @throws {BadMessageState}
 */
export async function get(queueId: string, messageId: string): Promise<IMessage> {
  await maintain(queueId)

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
  await maintain(queueId)

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
  await maintain(queueId)

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
  await maintain(queueId)

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
  await maintain(queueId)

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
  await maintain(queueId)

  await MQDAO.abandonAllFailedMessages(queueId)
}

export async function renewAllFailedMessages(queueId: string): Promise<void> {
  await maintain(queueId)

  await MQDAO.renewAllFailedMessages(queueId)
  queueMicrotask(() => SignalDAO.emit(queueId))
}

export async function clear(queueId: string): Promise<void> {
  await maintain(queueId)

  await MQDAO.clear(queueId)
}

export async function stats(queueId: string): Promise<IStats> {
  await maintain(queueId)

  return await MQDAO.stats(queueId)
}

export async function* getAllFailedMessageIds(queueId: string): AsyncIterable<string> {
  await maintain(queueId)

  yield* MQDAO.getAllFailedMessageIds(queueId)
}

export async function* getAllQueueIds(): AsyncIterable<string> {
  yield* MQDAO.getAllQueueIds()
}

async function maintain(queueId: string): Promise<void> {
  let emit = false
  const timestamp = Date.now()

  const configurations = await ConfigurationDAO.getConfigurations(queueId)

  const draftingTimeout = configurations.draftingTimeout ?? DRAFTING_TIMEOUT()
  if (draftingTimeout !== Infinity) {
    await MQDAO.fallbackOutdatedDraftingMessages(queueId, timestamp - draftingTimeout)
  }

  const orderedTimeout = configurations.orderedTimeout ?? ORDERED_TIMEOUT()
  if (orderedTimeout !== Infinity) {
    const changed = await MQDAO.fallbackOutdatedOrderedMessages(queueId, timestamp - orderedTimeout)
    if (changed) emit = true
  }

  const activeTimeout = configurations.activeTimeout ?? ACTIVE_TIMEOUT()
  if (activeTimeout !== Infinity) {
    const changed = await MQDAO.fallbackOutdatedActiveMessages(queueId, timestamp - activeTimeout)
    if (changed) emit = true
  }

  if (emit) await SignalDAO.emit(queueId)
}

async function maintainAllQueues() {
  for await (const id of MQDAO.getAllWorkingQueueIds()) {
    await maintain(id)
  }
}

export class BadMessageState extends CustomError {}

export class NotFound extends CustomError {}

export class DuplicatePayload extends CustomError {}
