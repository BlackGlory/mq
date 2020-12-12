import { getSignalStation } from './signal-station'

export function emit(key: string): void {
  const signal = getSignalStation().get(key)
  signal.emit()
  signal.refresh()
}
