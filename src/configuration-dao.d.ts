interface IConfiguration {
  unique: boolean | null
  draftingTimeout: number | null
  orderedTimeout: number | null
  activeTimeout: number | null
  concurrency: number | null
  throttle: {
    duration: number
    limit: number
  } | null
}

interface Throttle {
  duration: number
  limit: number
}

interface IConfigurationDAO {
  getAllNamespacesWithConfiguration(): Promise<string[]>
  getConfiguration(namespace: string): Promise<IConfiguration>

  setUnique(namespace: string, val: boolean): Promise<void>
  unsetUnique(namespace: string): Promise<void>

  setDraftingTimeout(namespace: string, val: number): Promise<void>
  unsetDraftingTimeout(namespace: string): Promise<void>

  setOrderedTimeout(namespace: string, val: number): Promise<void>
  unsetOrderedTimeout(namespace: string): Promise<void>

  setActiveTimeout(namespace: string, val: number): Promise<void>
  unsetActiveTimeout(namespace: string): Promise<void>

  setConcurrency(namespace: string, val: number): Promise<void>
  unsetConcurrency(namespace: string): Promise<void>

  setThrottle(namespace: string, val: Throttle): Promise<void>
  unsetThrottle(namespace: string): Promise<void>
}
