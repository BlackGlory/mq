import * as crypto from 'crypto'

export function hash(text: string): string {
  const hash = crypto.createHash('sha256')
  hash.update(text)
  return hash.digest('hex')
}
