import { ADMIN_PASSWORD } from '@env/index.js'

export function isAdmin(password: string): boolean {
  return !!(
    ADMIN_PASSWORD() &&
    password === ADMIN_PASSWORD()
  )
}
