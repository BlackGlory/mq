import { abandonAllFailedMessages as _abandonAllFailedMessages } from '@dao/abandon-all-failed-messages.js'

export function abandonAllFailedMessages(namespace: string): null {
  _abandonAllFailedMessages(namespace)

  return null
}
