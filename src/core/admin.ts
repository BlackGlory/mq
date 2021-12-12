import { ADMIN_PASSWORD } from '@env'

export function isAdmin(password: string): boolean {
  return !!(
    ADMIN_PASSWORD() &&
    password === ADMIN_PASSWORD()
  )
}
