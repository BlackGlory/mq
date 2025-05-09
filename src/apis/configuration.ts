import { ConfigurationDAO } from '@dao/configuration/index.js'
import { IConfiguration } from '@src/contract.js'

export function getAllNamespaces(): string[] {
  return ConfigurationDAO.getAllNamespacesWithConfiguration()
}

export function get(namespace: string): IConfiguration {
  return ConfigurationDAO.getConfiguration(namespace)
}

export function setUnique(namespace: string, val: boolean): null {
  ConfigurationDAO.setUnique(namespace, val)

  return null
}

export function unsetUnique(namespace: string): null {
  ConfigurationDAO.unsetUnique(namespace)

  return null
}

export function setDraftingTimeout(namespace: string, val: number): null {
  ConfigurationDAO.setDraftingTimeout(namespace, val)

  return null
}

export function unsetDraftingTimeout(namespace: string): null {
  ConfigurationDAO.unsetDraftingTimeout(namespace)

  return null
}

export function setOrderedTimeout(namespace: string, val: number): null {
  ConfigurationDAO.setOrderedTimeout(namespace, val)

  return null
}

export function unsetOrderedTimeout(namespace: string): null {
  ConfigurationDAO.unsetOrderedTimeout(namespace)

  return null
}

export function setActiveTimeout(namespace: string, val: number): null {
  ConfigurationDAO.setActiveTimeout(namespace, val)

  return null
}

export function unsetActiveTimeout(namespace: string): null {
  ConfigurationDAO.unsetActiveTimeout(namespace)

  return null
}

export function setConcurrency(namespace: string, val: number): null {
  ConfigurationDAO.setConcurrency(namespace, val)

  return null
}

export function unsetConcurrency(namespace: string): null {
  ConfigurationDAO.unsetConcurrency(namespace)

  return null
}
