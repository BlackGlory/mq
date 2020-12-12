import { AccessControlDAO } from '@dao'

export function getAllIds(): Promise<string[]> {
  return AccessControlDAO.getAllIdsWithTokenPolicies()
}

export function get(id: string): Promise<ITokenPolicy> {
  return AccessControlDAO.getTokenPolicies(id)
}

export function setProduceTokenRequired(id: string, val: boolean): Promise<void> {
  return AccessControlDAO.setProduceTokenRequired(id, val)
}

export function unsetProduceTokenRequired(id: string): Promise<void> {
  return AccessControlDAO.unsetProduceTokenRequired(id)
}

export function setConsumeTokenRequired(id: string, val: boolean): Promise<void> {
  return AccessControlDAO.setConsumeTokenRequired(id, val)
}

export function unsetConsumeTokenRequired(id: string): Promise<void> {
  return AccessControlDAO.unsetConsumeTokenRequired(id)
}

export function setClearTokenRequired(id: string, val: boolean): Promise<void> {
  return AccessControlDAO.setClearTokenRequired(id, val)
}

export function unsetClearTokenRequired(id: string): Promise<void> {
  return AccessControlDAO.unsetClearTokenRequired(id)
}
