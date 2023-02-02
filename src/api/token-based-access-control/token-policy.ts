import { AccessControlDAO } from '@dao/index.js'
import { ITokenPolicy } from '../contract.js'

export function getAllNamespaces(): string[] {
  return AccessControlDAO.TokenPolicy.getAllNamespacesWithTokenPolicies()
}

export function get(namespace: string): ITokenPolicy {
  return AccessControlDAO.TokenPolicy.getTokenPolicies(namespace)
}

export function setProduceTokenRequired(namespace: string, val: boolean): void {
  AccessControlDAO.TokenPolicy.setProduceTokenRequired(namespace, val)
}

export function unsetProduceTokenRequired(namespace: string): void {
  AccessControlDAO.TokenPolicy.unsetProduceTokenRequired(namespace)
}

export function setConsumeTokenRequired(namespace: string, val: boolean): void {
  AccessControlDAO.TokenPolicy.setConsumeTokenRequired(namespace, val)
}

export function unsetConsumeTokenRequired(namespace: string): void {
  AccessControlDAO.TokenPolicy.unsetConsumeTokenRequired(namespace)
}

export function setClearTokenRequired(namespace: string, val: boolean): void {
  AccessControlDAO.TokenPolicy.setClearTokenRequired(namespace, val)
}

export function unsetClearTokenRequired(namespace: string): void {
  AccessControlDAO.TokenPolicy.unsetClearTokenRequired(namespace)
}
