import { AccessControlDAO } from '@dao/index.js'
import { ITokenInfo } from '../contract.js'

export function getAllNamespaces(): string[] {
  return AccessControlDAO.Token.getAllNamespacesWithTokens()
}

export function getAll(namespace: string): Array<ITokenInfo> {
  return AccessControlDAO.Token.getAllTokens(namespace)
}

export function setProduceToken(namespace: string, token: string): void {
  AccessControlDAO.Token.setProduceToken({ namespace, token })
}

export function unsetProduceToken(namespace: string, token: string): void {
  AccessControlDAO.Token.unsetProduceToken({ namespace, token })
}

export function setConsumeToken(namespace: string, token: string): void {
  AccessControlDAO.Token.setConsumeToken({ namespace, token })
}

export function unsetConsumeToken(namespace: string, token: string): void {
  AccessControlDAO.Token.unsetConsumeToken({ namespace, token })
}

export function setClearToken(namespace: string, token: string): void {
  AccessControlDAO.Token.setClearToken({ namespace, token })
}

export function unsetClearToken(namespace: string, token: string): void {
  AccessControlDAO.Token.unsetClearToken({ namespace, token })
}
