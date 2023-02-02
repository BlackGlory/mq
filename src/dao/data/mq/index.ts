import { draftMessage } from './draft-message.js'
import { setMessage } from './set-message.js'
import { orderMessage } from './order-message.js'
import { getMessage } from './get-message.js'
import { abandonMessage } from './abandon-message.js'
import { completeMessage } from './complete-message.js'
import { failMessage } from './fail-message.js'
import { renewMessage } from './renew-message.js'
import { abandonAllFailedMessages } from './abandon-all-failed-messages.js'
import { renewAllFailedMessages } from './renew-all-failed-messages.js'
import { stats } from './stats.js'
import { clear } from './clear.js'
import { getAllFailedMessageIds } from './get-all-failed-message-ids.js'
import { getAllWorkingNamespaces } from './get-all-working-namespaces.js'
import { getAllNamespaces } from './get-all-namespaces.js'
import {
  rollbackOutdatedDraftingMessages
, rollbackOutdatedOrderedMessages
, rollbackOutdatedActiveMessages
} from './rollback-outdated-messages.js'
import { BadMessageState, NotFound, DuplicatePayload } from './error.js'
import { IMQDAO } from './contract.js'

export const MQDAO: IMQDAO = {
  draftMessage
, setMessage
, orderMessage
, getMessage
, abandonMessage
, completeMessage
, failMessage
, renewMessage

, abandonAllFailedMessages
, renewAllFailedMessages

, clear
, stats

, getAllFailedMessageIds
, getAllWorkingNamespaces
, getAllNamespaces

, rollbackOutdatedDraftingMessages
, rollbackOutdatedOrderedMessages
, rollbackOutdatedActiveMessages

, NotFound
, BadMessageState
, DuplicatePayload
}
