import {
  TOKEN_BASED_ACCESS_CONTROL
, CONSUME_TOKEN_REQUIRED
, PRODUCE_TOKEN_REQUIRED
, CLEAR_TOKEN_REQUIRED
} from '@env/index.js'
import { AccessControlDAO } from '@dao/index.js'
import * as TokenPolicy from './token-policy.js'
import * as Token from './token.js'
import { CustomError } from '@blackglory/errors'
import { IAPI } from '../contract.js'

class Unauthorized extends CustomError {}

export const TBAC: IAPI['TBAC'] = {
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
function checkProducePermission(namespace: string, token?: string): void {
  if (!isEnabled()) return

  const tokenRequired =
    TokenPolicy.get(namespace).produceTokenRequired ??
    PRODUCE_TOKEN_REQUIRED()

  if (tokenRequired) {
    if (!token) throw new Unauthorized()
    if (!AccessControlDAO.Token.matchProduceToken({ token, namespace })) throw new Unauthorized()
  }
}

/**
 * @throws {Unauthorized}
 */
function checkConsumePermission(namespace: string, token?: string): void {
  if (!isEnabled()) return

  const tokenRequired =
    TokenPolicy.get(namespace).consumeTokenRequired ??
    CONSUME_TOKEN_REQUIRED()

  if (tokenRequired) {
    if (!token) throw new Unauthorized()
    if (!AccessControlDAO.Token.matchConsumeToken({ token, namespace })) throw new Unauthorized()
  }
}

/**
 * @throws {Unauthorized}
 */
function checkClearPermission(namespace: string, token?: string): void {
  if (!isEnabled()) return

  const tokenRequired =
    TokenPolicy.get(namespace).clearTokenRequired ??
    CLEAR_TOKEN_REQUIRED()

  if (tokenRequired) {
    if (!token) throw new Unauthorized()
    if (!AccessControlDAO.Token.matchClearToken({ token, namespace })) throw new Unauthorized()
  }
}
