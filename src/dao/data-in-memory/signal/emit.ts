import { getSignalStation } from './signal-station'

export function emit(key: string): void {
  const station = getSignalStation()
  const signal = station.get(key)
  signal.emit()
  station.refresh(key)
}
