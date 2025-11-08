<<<<<<< Updated upstream

export * as CONSTANT from './response'
export * as ERROR from './error'
=======
// Re-export constants from shared-types
import { STATUS_CODE, USER_ERRORS, SERVER_ERRORS, GOOGLE_AUTH_ERRORS } from 'shared-types'

export const CONSTANT = STATUS_CODE

export const ERROR = {
  USER_ERRORS,
  SERVER_ERRORS,
  GOOGLE_AUTH_ERRORS
}

export { USER_ERRORS, SERVER_ERRORS, GOOGLE_AUTH_ERRORS }
>>>>>>> Stashed changes
