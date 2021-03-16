interface Configuration {
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
  getAllIdsWithConfiguration(): Promise<string[]>
  getConfiguration(queueId: string): Promise<Configuration>

  setUnique(queueId: string, val: boolean): Promise<void>
  unsetUnique(queueId: string): Promise<void>

  setDraftingTimeout(queueId: string, val: number): Promise<void>
  unsetDraftingTimeout(queueId: string): Promise<void>

  setOrderedTimeout(queueId: string, val: number): Promise<void>
  unsetOrderedTimeout(queueId: string): Promise<void>

  setActiveTimeout(queueId: string, val: number): Promise<void>
  unsetActiveTimeout(queueId: string): Promise<void>

  setConcurrency(queueId: string, val: number): Promise<void>
  unsetConcurrency(queueId: string): Promise<void>

  setThrottle(queueId: string, val: Throttle): Promise<void>
  unsetThrottle(queueId: string): Promise<void>
}
