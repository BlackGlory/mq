import { AccessControlDAO } from '@dao'

export function getAllIds(): Promise<string[]> {
  return AccessControlDAO.getAllIdsWithTokens()
}

export function getAll(id: string): Promise<Array<ITokenInfo>> {
  return AccessControlDAO.getAllTokens(id)
}

export function setProduceToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.setProduceToken({ id, token })
}

export function unsetProduceToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.unsetProduceToken({ id, token })
}

export function setConsumeToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.setConsumeToken({ id, token })
}

export function unsetConsumeToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.unsetConsumeToken({ id, token })
}

export function setClearToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.setClearToken({ id, token })
}

export function unsetClearToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.unsetClearToken({ id, token })
}
