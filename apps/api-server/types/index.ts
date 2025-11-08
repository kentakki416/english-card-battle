// ===== Local API types =====

// Core types
export * from './result'

// Domain types
export * as Domain from './domain'

// Database types
export * as Mongo from './mongo'

// ===== Shared types (from shared-types package) =====
export * from 'shared-types'

// Re-export commonly used types for convenience
export { Result, Success, Failure } from './result'

// Re-export from shared-types for backward compatibility
export { 
  UserError, 
  ServerError, 
  GoogleAuthError,
  USER_ERRORS,
  SERVER_ERRORS,
  GOOGLE_AUTH_ERRORS,
  LoginRequest,
  LoginResponse,
  GoogleLoginRequest,
  GoogleLoginResponse,
  GoogleLoginErrorResponse,
  SignupRequest,
  SignupResponse,
  STATUS_CODE,
  type Response
} from 'shared-types'

// Controller namespace for backward compatibility
export * as Controller from 'shared-types'
