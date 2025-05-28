import { getQueueConfiguration } from '@dao/get-queue-configuration.js'
import { getAllWorkingQueueIds } from '@dao/get-all-working-queue-ids.js'
import { eventHub, Event } from '@src/event-hub.js'
import { SyncDestructor } from 'extra-defer'
import { getTimestamp } from '@utils/get-timestamp.js'
import { removeTimedOutDraftingMessages } from '@dao/remove-timed-out-drafting-messsages.js'
import { renewTimedOutOrderedMessages } from '@dao/renew-timed-out-ordered-messages.js'
import { renewTimedOutActiveMessages } from '@dao/renew-timed-out-active-messages.js'
import { getClosestTimeoutTimestamp } from '@dao/get-closest-timeout-timestamp.js'
import { setSchedule } from 'extra-timers'
import { isntNull } from 'extra-utils'

const queueIdToCancelSchedule: Map<string, () => void> = new Map()

export function startMaintainer(): () => void {
  const destructor = new SyncDestructor()

  destructor.defer(eventHub.onGlobal(Event.QueueSet, queueId => {
    rollbackTimedOutMessages(queueId, getTimestamp())

    updateSchedule(queueId)
  }))

  destructor.defer(eventHub.onGlobal(Event.QueueReset, queueId => {
    updateSchedule(queueId)
  }))

  destructor.defer(eventHub.onGlobal(Event.QueueRemoved, queueId => {
    updateSchedule(queueId)
  }))

  destructor.defer(eventHub.onGlobal(Event.DraftingMessageAdded, queueId => {
    updateSchedule(queueId)
  }))

  destructor.defer(eventHub.onGlobal(Event.MessageStateWaitingToOrdered, queueId => {
    updateSchedule(queueId)
  }))

  destructor.defer(eventHub.onGlobal(Event.MessageStateOrderedToActive, queueId => {
    updateSchedule(queueId)
  }))

  const queueIds = getAllWorkingQueueIds()
  const timestamp = getTimestamp()
  for (const queueId of queueIds) {
    rollbackTimedOutMessages(queueId, timestamp)

    updateSchedule(queueId)
  }

  return () => {
    destructor.execute()

    queueIdToCancelSchedule.forEach(cancel => cancel())
    queueIdToCancelSchedule.clear()
  }
}

function updateSchedule(queueId: string): void {
  const cancelSchedule = queueIdToCancelSchedule.get(queueId)
  cancelSchedule?.()
  queueIdToCancelSchedule.delete(queueId)

  const timestamp = getClosestTimeoutTimestamp(queueId)
  if (isntNull(timestamp)) {
    const cancelSchedule = setSchedule(timestamp, () => {
      rollbackTimedOutMessages(queueId, getTimestamp())

      updateSchedule(queueId)
    })
    queueIdToCancelSchedule.set(queueId, cancelSchedule)
  }
}

function rollbackTimedOutMessages(queueId: string, timestamp: number): void {
  const config = getQueueConfiguration(queueId)
  if (!config) return

  const draftingTimeout = config.draftingTimeout
  if (removeTimedOutDraftingMessages(queueId, timestamp, draftingTimeout)) {
    eventHub.emit(queueId, Event.DraftingMessageRemoved)
  }

  const orderedTimeout = config.orderedTimeout
  if (renewTimedOutOrderedMessages(queueId, timestamp, orderedTimeout)) {
    eventHub.emit(queueId, Event.MessageStateOrderedToWaiting)
  }

  const activeTimeout = config.activeTimeout
  if (renewTimedOutActiveMessages(queueId, timestamp, activeTimeout)) {
    eventHub.emit(queueId, Event.MessageStateActiveToWaiting)
  }
}
