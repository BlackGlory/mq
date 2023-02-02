import { AccessControlDAO } from '@dao/index.js'
import { LIST_BASED_ACCESS_CONTROL, ListBasedAccessControl } from '@env/index.js'
import { CustomError } from '@blackglory/errors'

export function getAll(): string[] {
  return AccessControlDAO.Blacklist.getAllBlacklistItems()
}

export function add(namespace: string): void {
  AccessControlDAO.Blacklist.addBlacklistItem(namespace)
}

export function remove(namespace: string): void {
  AccessControlDAO.Blacklist.removeBlacklistItem(namespace)
}

export function isEnabled(): boolean {
  return LIST_BASED_ACCESS_CONTROL() === ListBasedAccessControl.Blacklist
}

export function isBlocked(namespace: string): boolean {
  return AccessControlDAO.Blacklist.inBlacklist(namespace)
}

/**
 * @throws {Forbidden}
 */
export function check(namespace: string): void {
  if (isEnabled() && isBlocked(namespace)) throw new Forbidden()
}

export class Forbidden extends CustomError {}
