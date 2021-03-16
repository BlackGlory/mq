import { ConfigurationDAO } from '@dao/config-in-sqlite3/configuration'

export function getAllIds(): Promise<string[]> {
  return ConfigurationDAO.getAllIdsWithConfiguration()
}

export function get(queueId: string): Promise<Configuration> {
  return ConfigurationDAO.getConfiguration(queueId)
}

export function setUnique(queueId: string, val: boolean): Promise<void> {
  return ConfigurationDAO.setUnique(queueId, val)
}

export function unsetUnique(queueId: string): Promise<void> {
  return ConfigurationDAO.unsetUnique(queueId)
}

export function setDraftingTimeout(queueId: string, val: number): Promise<void> {
  return ConfigurationDAO.setDraftingTimeout(queueId, val)
}

export function unsetDraftingTimeout(queueId: string): Promise<void> {
  return ConfigurationDAO.unsetDraftingTimeout(queueId)
}

export function setOrderedTimeout(queueId: string, val: number): Promise<void> {
  return ConfigurationDAO.setOrderedTimeout(queueId, val)
}

export function unsetOrderedTimeout(queueId: string): Promise<void> {
  return ConfigurationDAO.unsetOrderedTimeout(queueId)
}

export function setActiveTimeout(queueId: string, val: number): Promise<void> {
  return ConfigurationDAO.setActiveTimeout(queueId, val)
}

export function unsetActiveTimeout(queueId: string): Promise<void> {
  return ConfigurationDAO.unsetActiveTimeout(queueId)
}

export function setConcurrency(queueId: string, val: number): Promise<void> {
  return ConfigurationDAO.setConcurrency(queueId, val)
}

export function unsetConcurrency(queueId: string): Promise<void> {
  return ConfigurationDAO.unsetConcurrency(queueId)
}

export function setThrottle(queueId: string, val: Throttle): Promise<void> {
  return ConfigurationDAO.setThrottle(queueId, val)
}

export function unsetThrottle(queueId: string): Promise<void> {
  return ConfigurationDAO.unsetThrottle(queueId)
}
