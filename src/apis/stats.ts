import { stats as _stats } from '@dao/stats.js'
import { IStats } from '@src/contract.js'

export function stats(namespace: string): IStats {
  return _stats(namespace)
}
