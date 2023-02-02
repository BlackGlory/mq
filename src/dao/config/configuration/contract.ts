import { IConfiguration } from '@api/contract.js'
export { IConfiguration } from '@api/contract.js'

export interface IConfigurationDAO {
  getAllNamespacesWithConfiguration(): string[]
  getConfiguration(namespace: string): IConfiguration

  setUnique(namespace: string, val: boolean): void
  unsetUnique(namespace: string): void

  setDraftingTimeout(namespace: string, val: number): void
  unsetDraftingTimeout(namespace: string): void

  setOrderedTimeout(namespace: string, val: number): void
  unsetOrderedTimeout(namespace: string): void

  setActiveTimeout(namespace: string, val: number): void
  unsetActiveTimeout(namespace: string): void

  setConcurrency(namespace: string, val: number): void
  unsetConcurrency(namespace: string): void
}
