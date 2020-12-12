import { getSignalStation } from './signal-station'

export async function wait(key: string): Promise<void> {
  const signal = getSignalStation().get(key)
  await signal
}
