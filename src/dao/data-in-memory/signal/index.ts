import { EventEmitter } from 'events'
import { waitForEventEmitter } from '@blackglory/wait-for'

const emitter = new EventEmitter()

export const SignalDAO: ISignalDAO = {
  emit(key: string): void {
    emitter.emit(key, null)
  }
, async wait(key: string): Promise<void> {
    await waitForEventEmitter(emitter, key)
  }
}
