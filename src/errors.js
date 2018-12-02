import httpStatus from 'http-status'

// TODO: Log the error to Google Stackdriver, Rollbar etc.
function report(error) {
  // eslint-disable-next-line no-console
  console.error(error)
}

export class ValidationError extends Error {
  code = 400

  constructor(errors) {
    super('The request is invalid.')
    this.state = errors.reduce((result, error) => {
      if (Object.prototype.hasOwnProperty.call(result, error.key)) {
        result[error.key].push(error.message)
      } else {
        Object.defineProperty(result, error.key, {
          value: [error.message],
          enumerable: true,
        })
      }
      return result
    }, {})
  }
}

export class UnauthorizedError extends Error {
  code = 401

  message = this.message || httpStatus[401]
}

export class ForbiddenError extends Error {
  code = 403

  message = this.message || httpStatus[403]
}

export class NotFoundError extends Error {
  code = 404

  message = this.message || httpStatus[404]
}

export default { report }
