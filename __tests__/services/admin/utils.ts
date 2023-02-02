import { assert, isntUndefined } from '@blackglory/prelude'

export function createAuthHeaders(adminPassword?: string) {
  const value = adminPassword ?? process.env.MQ_ADMIN_PASSWORD
  assert(isntUndefined(value), 'The value should not be undefined')

  return { 'Authorization': `Bearer ${value}` }
}
