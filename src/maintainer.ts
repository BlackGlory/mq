import { toArray } from '@blackglory/prelude'
import { getConfiguration } from '@dao/configuration.js'
import { getAllWorkingNamespaces } from '@dao/get-all-working-namespaces.js'
import { rollbackOutdatedActiveMessages, rollbackOutdatedDraftingMessages, rollbackOutdatedOrderedMessages } from '@dao/rollback-outdated-messages.js'
import { setDynamicTimeoutLoop } from 'extra-timers'
import * as SignalDAO from '@dao/signal.js'
import ms from 'ms'

export function startMaintainer(): () => void {
  const stopTickLoop = setDynamicTimeoutLoop(ms('1s'), nextTick)

  return () => stopTickLoop()
}

export function nextTick(): null {
  const ids = toArray(getAllWorkingNamespaces())
  for (const id of ids) {
    nextTick(id)
  }

  return null

  function nextTick(namespace: string): void {
    let emit = false
    const timestamp = Date.now()

    const configurations = getConfiguration(namespace)

    const draftingTimeout = configurations.draftingTimeout ?? 60_000
    if (draftingTimeout !== Infinity) {
      rollbackOutdatedDraftingMessages(
        namespace
      , timestamp - draftingTimeout
      )
    }

    const orderedTimeout = configurations.orderedTimeout ?? 60_000
    if (orderedTimeout !== Infinity) {
      const changed = rollbackOutdatedOrderedMessages(
        namespace
      , timestamp - orderedTimeout
      )
      if (changed) emit = true
    }

    const activeTimeout = configurations.activeTimeout ??  300_000
    if (activeTimeout !== Infinity) {
      const changed = rollbackOutdatedActiveMessages(
        namespace
      , timestamp - activeTimeout
      )
      if (changed) emit = true
    }

    if (emit) SignalDAO.emit(namespace)
  }
}
