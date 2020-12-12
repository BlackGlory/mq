import { Signal } from 'extra-promise'
import { Station } from './station'

let station = createSignalStation()

export function getSignalStation(): Station<Signal> {
  return station
}

export function rebuildSignalStation(): void {
  station = createSignalStation()
}

function createSignalStation(): Station<Signal> {
  return new Station<Signal>(() => new Signal())
}
