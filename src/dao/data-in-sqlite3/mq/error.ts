export class BadMessageState extends Error {
  constructor(...requiredStates: [string, ...string[]]) {
    if (requiredStates.length === 1) {
      super(`The state of message must be "${requiredStates[0]}"`)
    } else {
      const text = requiredStates
        .map(x => `"${x}"`)
        .join(', ')
      super(`The state of message must be one of ${text}`)
    }
    this.name = this.constructor.name
  }
}

export class NotFound extends Error {
  name = this.constructor.name
}
