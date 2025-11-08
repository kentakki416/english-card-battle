
// Core types
export * from './result'

// Domain types
export * as Domain from './domain'

// Database types
export * as Mongo from './mongo'

// ===== Shared types (from shared-types package) =====
export * from 'shared-types'

// Re-export commonly used types for convenience
export type { Result } from './result'
export { Success, Failure } from './result'

// Re-export from shared-types for backward compatibility
export type { 
  UserError, 
  ServerError, 
  GoogleAuthError,
  LoginRequest,
  LoginResponse,
  GoogleLoginRequest,
  GoogleLoginResponse,
  GoogleLoginErrorResponse,
  SignupRequest,
  SignupResponse,
  Response
} from 'shared-types'

// Re-export constants (not types)
export { 
  USER_ERRORS,
  SERVER_ERRORS,
  GOOGLE_AUTH_ERRORS,
  STATUS_CODE
} from 'shared-types'

// Controller namespace for backward compatibility
export * as Controller from 'shared-types'
