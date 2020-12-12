import { Unauthorized } from '../error'
import {
  TOKEN_BASED_ACCESS_CONTROL
, CONSUME_TOKEN_REQUIRED
, PRODUCE_TOKEN_REQUIRED
, CLEAR_TOKEN_REQUIRED
} from '@env'
import { AccessControlDAO } from '@dao'
import * as TokenPolicy from './token-policy'
import * as Token from './token'

export const TBAC: ICore['TBAC'] = {
  isEnabled
, checkProducePermission
, checkConsumePermission
, checkClearPermission
, TokenPolicy
, Token
}

function isEnabled() {
  return TOKEN_BASED_ACCESS_CONTROL()
}

async function checkProducePermission(id: string, token?: string) {
  if (!isEnabled()) return

  const tokenRequired =
    (await TokenPolicy.get(id)).produceTokenRequired
  ?? PRODUCE_TOKEN_REQUIRED()

  if (tokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchProduceToken({ token, id })) throw new Unauthorized()
  }

}

async function checkConsumePermission(id: string, token?: string) {
  if (!isEnabled()) return

  const tokenRequired =
    (await TokenPolicy.get(id)).consumeTokenRequired
  ?? CONSUME_TOKEN_REQUIRED()

  if (tokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchConsumeToken({ token, id })) throw new Unauthorized()
  }
}

async function checkClearPermission(id: string, token?: string) {
  if (!isEnabled()) return

  const tokenRequired =
    (await TokenPolicy.get(id)).clearTokenRequired
  ?? CLEAR_TOKEN_REQUIRED()

  if (tokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchClearToken({ token, id })) throw new Unauthorized()
  }
}
