import { AccessControlDAO } from '@dao'

export function getAllNamespaces(): Promise<string[]> {
  return AccessControlDAO.getAllNamespacesWithTokens()
}

export function getAll(namespace: string): Promise<Array<ITokenInfo>> {
  return AccessControlDAO.getAllTokens(namespace)
}

export function setProduceToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.setProduceToken({ namespace, token })
}

export function unsetProduceToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.unsetProduceToken({ namespace, token })
}

export function setConsumeToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.setConsumeToken({ namespace, token })
}

export function unsetConsumeToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.unsetConsumeToken({ namespace, token })
}

export function setClearToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.setClearToken({ namespace, token })
}

export function unsetClearToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.unsetClearToken({ namespace, token })
}
