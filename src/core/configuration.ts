import { ConfigurationDAO } from '@dao/config-in-sqlite3/configuration'

export function getAllNamespaces(): Promise<string[]> {
  return ConfigurationDAO.getAllNamespacesWithConfiguration()
}

export function get(namespace: string): Promise<IConfiguration> {
  return ConfigurationDAO.getConfiguration(namespace)
}

export function setUnique(namespace: string, val: boolean): Promise<void> {
  return ConfigurationDAO.setUnique(namespace, val)
}

export function unsetUnique(namespace: string): Promise<void> {
  return ConfigurationDAO.unsetUnique(namespace)
}

export function setDraftingTimeout(namespace: string, val: number): Promise<void> {
  return ConfigurationDAO.setDraftingTimeout(namespace, val)
}

export function unsetDraftingTimeout(namespace: string): Promise<void> {
  return ConfigurationDAO.unsetDraftingTimeout(namespace)
}

export function setOrderedTimeout(namespace: string, val: number): Promise<void> {
  return ConfigurationDAO.setOrderedTimeout(namespace, val)
}

export function unsetOrderedTimeout(namespace: string): Promise<void> {
  return ConfigurationDAO.unsetOrderedTimeout(namespace)
}

export function setActiveTimeout(namespace: string, val: number): Promise<void> {
  return ConfigurationDAO.setActiveTimeout(namespace, val)
}

export function unsetActiveTimeout(namespace: string): Promise<void> {
  return ConfigurationDAO.unsetActiveTimeout(namespace)
}

export function setConcurrency(namespace: string, val: number): Promise<void> {
  return ConfigurationDAO.setConcurrency(namespace, val)
}

export function unsetConcurrency(namespace: string): Promise<void> {
  return ConfigurationDAO.unsetConcurrency(namespace)
}
