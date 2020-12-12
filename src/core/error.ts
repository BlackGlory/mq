export class Forbidden extends Error {
  name = this.constructor.name
  message = 'Forbidden'
}

export class Unauthorized extends Error {
  name = this.constructor.name
  message = 'Unauthorized'
}

export class NotFound extends Error {
  name = this.constructor.name
  message = 'NotFound'
}

export class IncorrectRevision extends Error {
  name = this.constructor.name
  message = 'IncorrectRevision'
}
