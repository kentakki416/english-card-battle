// Re-export constants from shared-types
import { STATUS_CODE, USER_ERRORS, SERVER_ERRORS, GOOGLE_AUTH_ERRORS } from 'shared-types'
import { ENGLISH_STUDY_ERRORS } from './error/english_study'

export const CONSTANT = STATUS_CODE

export const ERROR = {
  USER_ERRORS,
  SERVER_ERRORS,
  GOOGLE_AUTH_ERRORS,
  ENGLISH_STUDY_ERRORS
}

export { USER_ERRORS, SERVER_ERRORS, GOOGLE_AUTH_ERRORS, ENGLISH_STUDY_ERRORS }
