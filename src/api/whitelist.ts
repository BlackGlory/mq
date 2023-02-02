import { AccessControlDAO } from '@dao/index.js'
import { LIST_BASED_ACCESS_CONTROL, ListBasedAccessControl } from '@env/index.js'
import { CustomError } from '@blackglory/errors'

export function getAll(): string[] {
  return AccessControlDAO.Whitelist.getAllWhitelistItems()
}

export function add(namespace: string): void {
  AccessControlDAO.Whitelist.addWhitelistItem(namespace)
}

export function remove(namespace: string): void {
  AccessControlDAO.Whitelist.removeWhitelistItem(namespace)
}

export function isBlocked(namespace: string): boolean {
  return !AccessControlDAO.Whitelist.inWhitelist(namespace)
}

export function isEnabled(): boolean {
  return LIST_BASED_ACCESS_CONTROL() === ListBasedAccessControl.Whitelist
}

/**
 * @throws {Forbidden}
 */
export function check(namespace: string): void {
  if (isEnabled() && isBlocked(namespace)) throw new Forbidden()
}

export class Forbidden extends CustomError {}
