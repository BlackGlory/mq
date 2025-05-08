import { ConfigurationDAO } from '@dao/configuration/index.js'
import { IConfiguration } from './contract.js'

export function getAllNamespaces(): string[] {
  return ConfigurationDAO.getAllNamespacesWithConfiguration()
}

export function get(namespace: string): IConfiguration {
  return ConfigurationDAO.getConfiguration(namespace)
}

export function setUnique(namespace: string, val: boolean): void {
  ConfigurationDAO.setUnique(namespace, val)
}

export function unsetUnique(namespace: string): void {
  ConfigurationDAO.unsetUnique(namespace)
}

export function setDraftingTimeout(namespace: string, val: number): void {
  ConfigurationDAO.setDraftingTimeout(namespace, val)
}

export function unsetDraftingTimeout(namespace: string): void {
  ConfigurationDAO.unsetDraftingTimeout(namespace)
}

export function setOrderedTimeout(namespace: string, val: number): void {
  ConfigurationDAO.setOrderedTimeout(namespace, val)
}

export function unsetOrderedTimeout(namespace: string): void {
  ConfigurationDAO.unsetOrderedTimeout(namespace)
}

export function setActiveTimeout(namespace: string, val: number): void {
  ConfigurationDAO.setActiveTimeout(namespace, val)
}

export function unsetActiveTimeout(namespace: string): void {
  ConfigurationDAO.unsetActiveTimeout(namespace)
}

export function setConcurrency(namespace: string, val: number): void {
  ConfigurationDAO.setConcurrency(namespace, val)
}

export function unsetConcurrency(namespace: string): void {
  ConfigurationDAO.unsetConcurrency(namespace)
}
