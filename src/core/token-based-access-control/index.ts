import {
  TOKEN_BASED_ACCESS_CONTROL
, CONSUME_TOKEN_REQUIRED
, PRODUCE_TOKEN_REQUIRED
, CLEAR_TOKEN_REQUIRED
} from '@env'
import { AccessControlDAO } from '@dao'
import * as TokenPolicy from './token-policy'
import * as Token from './token'
import { CustomError } from '@blackglory/errors'

class Unauthorized extends CustomError {}

export const TBAC: ICore['TBAC'] = {
  isEnabled
, checkProducePermission
, checkConsumePermission
, checkClearPermission
, Unauthorized
, TokenPolicy
, Token
}

function isEnabled() {
  return TOKEN_BASED_ACCESS_CONTROL()
}

/**
 * @throws {Unauthorized}
 */
async function checkProducePermission(namespace: string, token?: string): Promise<void> {
  if (!isEnabled()) return

  const tokenRequired =
    (await TokenPolicy.get(namespace)).produceTokenRequired ??
    PRODUCE_TOKEN_REQUIRED()

  if (tokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchProduceToken({ token, namespace })) throw new Unauthorized()
  }
}

/**
 * @throws {Unauthorized}
 */
async function checkConsumePermission(namespace: string, token?: string): Promise<void> {
  if (!isEnabled()) return

  const tokenRequired =
    (await TokenPolicy.get(namespace)).consumeTokenRequired ??
    CONSUME_TOKEN_REQUIRED()

  if (tokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchConsumeToken({ token, namespace })) throw new Unauthorized()
  }
}

/**
 * @throws {Unauthorized}
 */
async function checkClearPermission(namespace: string, token?: string): Promise<void> {
  if (!isEnabled()) return

  const tokenRequired =
    (await TokenPolicy.get(namespace)).clearTokenRequired ??
    CLEAR_TOKEN_REQUIRED()

  if (tokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchClearToken({ token, namespace })) throw new Unauthorized()
  }
}
