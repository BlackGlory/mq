import { AccessControlDAO } from '@dao/index.js'

export function getAllNamespaces(): Promise<string[]> {
  return AccessControlDAO.getAllNamespacesWithTokenPolicies()
}

export function get(namespace: string): Promise<ITokenPolicy> {
  return AccessControlDAO.getTokenPolicies(namespace)
}

export function setProduceTokenRequired(namespace: string, val: boolean): Promise<void> {
  return AccessControlDAO.setProduceTokenRequired(namespace, val)
}

export function unsetProduceTokenRequired(namespace: string): Promise<void> {
  return AccessControlDAO.unsetProduceTokenRequired(namespace)
}

export function setConsumeTokenRequired(namespace: string, val: boolean): Promise<void> {
  return AccessControlDAO.setConsumeTokenRequired(namespace, val)
}

export function unsetConsumeTokenRequired(namespace: string): Promise<void> {
  return AccessControlDAO.unsetConsumeTokenRequired(namespace)
}

export function setClearTokenRequired(namespace: string, val: boolean): Promise<void> {
  return AccessControlDAO.setClearTokenRequired(namespace, val)
}

export function unsetClearTokenRequired(namespace: string): Promise<void> {
  return AccessControlDAO.unsetClearTokenRequired(namespace)
}
