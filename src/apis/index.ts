import { ImplementationOf } from 'delight-rpc'
import { IAPI } from '@src/contract.js'
import { getAllQueueIds } from './get-all-queue-ids.js'
import { getQueue } from './get-queue.js'
import { setQueue } from './set-queue.js'
import { removeQueue } from './remove-queue.js'
import { getQueueStats } from './get-queue-stats.js'
import { resetQueue } from './reset-queue.js'
import { draftMessage} from './draft-message.js'
import { setMessageSlot } from './set-message-slot.js'
import { orderMessage } from './order-message.js'
import { getMessage } from './get-message.js'
import { peekMessage } from './peek-message.js'
import { completeMessage } from './complete-message.js'
import { failMessage } from './fail-message.js'
import { renewMessage } from './renew-message.js'
import { abandonMessage } from './abandon-message.js'
import { removeMessage } from './remove-message.js'
import { abandonAllFailedMessages } from './abandon-all-failed-messages.js'
import { renewAllFailedMessages } from './renew-all-failed-messages.js'
import { getMessageIdsByState } from './get-message-ids-by-state.js'
import { clearMessagesByState } from './clear-messages-by-state.js'

export const API: ImplementationOf<IAPI> = {
  getAllQueueIds
, getQueue
, setQueue
, removeQueue
, getQueueStats
, resetQueue
, draftMessage: draftMessage as ImplementationOf<IAPI>['draftMessage']
, setMessageSlot
, orderMessage
, getMessage
, peekMessage
, completeMessage
, failMessage
, renewMessage
, abandonMessage
, removeMessage
, abandonAllFailedMessages
, renewAllFailedMessages
, getMessageIdsByState
, clearMessagesByState
}
