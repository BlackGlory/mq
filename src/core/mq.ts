import { ConfigurationDAO, MQDAO, SignalDAO } from '@dao'
import { DRAFTING_TIMEOUT, ORDERED_TIMEOUT, ACTIVE_TIMEOUT, THROTTLE, UNIQUE } from '@env'
import { nanoid } from 'nanoid'
import { CustomError } from '@blackglory/errors'
import 'core-js/features/queue-microtask'

export async function draft(queueId: string, priority?: number): Promise<string> {
  await maintain(queueId)

  const messageId = nanoid()
  await MQDAO.draftMessage(queueId, messageId, priority)
  return messageId
}

/**
 * @throws {BadMessageState}
 */
export async function set(queueId: string, messageId: string, type: string, payload: string): Promise<void> {
  await maintain(queueId)

  const configurations = await ConfigurationDAO.getConfigurations(queueId)
  const unique = configurations.unique ?? UNIQUE()

  try {
    await MQDAO.setMessage(queueId, messageId, type, payload, unique)
    queueMicrotask(() => SignalDAO.emit(queueId))
  } catch (e) {
    if (e instanceof MQDAO.BadMessageState) throw new BadMessageState(e.message)
    throw e
  }
}

export async function order(queueId: string): Promise<string> {
  // TODO: support concurrency
  await maintain(queueId)

  const configurations = await ConfigurationDAO.getConfigurations(queueId)
  const throttle = THROTTLE()
  const duration = configurations.throttle?.duration ?? throttle.duration
  const limit = configurations.throttle?.limit ?? throttle.limit

  while (true) {
    const messageId = await MQDAO.orderMessage(queueId, duration, limit)
    if (messageId) return messageId
    // TODO: waiting outdated
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
 * @throws {BadMessageState}
 */
export async function complete(queueId: string, messageId: string): Promise<void> {
  await maintain(queueId)

  try {
    await MQDAO.completeMessage(queueId, messageId)
  } catch (e) {
    if (e instanceof MQDAO.BadMessageState) throw new NotFound(e.message)
    throw e
  }
}

/**
 * @throws {BadMessageState}
 */
export async function abandon(queueId: string, messageId: string): Promise<void> {
  await maintain(queueId)

  try {
    await MQDAO.abandonMessage(queueId, messageId)
  } catch (e) {
    if (e instanceof MQDAO.BadMessageState) throw new BadMessageState(e.message)
    throw e
  }
}

export async function clear(queueId: string): Promise<void> {
  await maintain(queueId)

  await MQDAO.clear(queueId)
}

export async function stats(queueId: string): Promise<IStats> {
  await maintain(queueId)

  return await MQDAO.stats(queueId)
}

async function maintain(queueId: string): Promise<void> {
  const timestamp = Date.now()

  const configurations = await ConfigurationDAO.getConfigurations(queueId)

  const draftingTimeout = configurations.draftingTimeout ?? DRAFTING_TIMEOUT()
  if (draftingTimeout !== Infinity) {
    await MQDAO.clearOutdatedDraftingMessages(queueId, timestamp - draftingTimeout)
  }

  const orderedTimeout = configurations.orderedTimeout ?? ORDERED_TIMEOUT()
  if (orderedTimeout !== Infinity) {
    await MQDAO.clearOutdatedOrderedMessages(queueId, timestamp - orderedTimeout)
  }

  const activeTimeout = configurations.activeTimeout ?? ACTIVE_TIMEOUT()
  if (activeTimeout !== Infinity) {
    await MQDAO.clearOutdatedActiveMessages(queueId, timestamp - activeTimeout)
  }
}

export class BadMessageState extends CustomError {}

export class NotFound extends CustomError {}
