import { ConfigurationDAO, MQDAO, SignalDAO } from '@dao'
import { DRAFTING_TIMEOUT, ORDERED_TIMEOUT, ACTIVE_TIMEOUT, THROTTLE } from '@env'
import { nanoid } from 'nanoid'

export async function draft(queueId: string, priority?: number): Promise<string> {
  try {
    const messageId = nanoid()
    await MQDAO.draftMessage(queueId, messageId, priority)
    return messageId
  } finally {
    await maintain(queueId)
  }
}

export async function set(queueId: string, messageId: string, type: string, payload: string): Promise<void> {
  try {
    await MQDAO.setMessage(queueId, messageId, type, payload)
    queueMicrotask(() => SignalDAO.emit(queueId))
  } finally {
    await maintain(queueId)
  }
}

export async function order(queueId: string): Promise<string> {
  try {
    const configurations = await ConfigurationDAO.getConfigurations(queueId)
    const throttle = THROTTLE()
    const duration = configurations.throttle?.duration ?? throttle.duration
    const limit = configurations.throttle?.limit ?? throttle.limit

    while (true) {
      const messageId = await MQDAO.orderMessage(queueId, duration, limit)
      if (messageId) return messageId
      await SignalDAO.wait(queueId)
    }
  } finally {
    await maintain(queueId)
  }
}

export async function get(queueId: string, messageId: string): Promise<IMessage> {
  try {
    const message = await MQDAO.getMessage(queueId, messageId)
    return message
  } finally {
    await maintain(queueId)
  }
}

export async function complete(queueId: string, messageId: string): Promise<void> {
  try {
    await MQDAO.completeMessage(queueId, messageId)
  } finally {
    await maintain(queueId)
  }
}

export async function abandon(queueId: string, messageId: string): Promise<void> {
  try {
    await MQDAO.abandonMessage(queueId, messageId)
  } finally {
    await maintain(queueId)
  }
}

export async function clear(queueId: string): Promise<void> {
  try {
    await MQDAO.clear(queueId)
  } finally {
    await maintain(queueId)
  }
}

export async function stats(queueId: string): Promise<IStats> {
  try {
    return await MQDAO.stats(queueId)
  } finally {
    await maintain(queueId)
  }
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
