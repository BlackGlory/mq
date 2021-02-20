import { CustomError } from '@blackglory/errors'

export class BadMessageState extends CustomError {
  constructor(...requiredStates: [string, ...string[]]) {
    if (requiredStates.length === 1) {
      super(`The state of message must be "${requiredStates[0]}"`)
    } else {
      const text = requiredStates
                     .map(x => `"${x}"`)
                     .join(', ')
      super(`The state of message must be one of ${text}`)
    }
  }
}

export class NotFound extends CustomError {}

export class DuplicatePayload extends CustomError {}
