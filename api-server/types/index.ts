<<<<<<< Updated upstream
=======
// ===== Local API types =====

>>>>>>> Stashed changes
// Core types
export * from './result'

// Domain types
export * as Domain from './domain'

<<<<<<< Updated upstream
// Controller types
export * as Controller from './controller'

// Database types
export * as Mongo from './mongo'

// Error types
export * as Error from './error'

// Re-export commonly used types for convenience
export { Result, Success, Failure } from './result'
=======
// Database types
export * as Mongo from './mongo'

// ===== Shared types (from shared-types package) =====
export * from 'shared-types'

// Re-export commonly used types for convenience
export { Result, Success, Failure } from './result'

// Re-export from shared-types for backward compatibility
>>>>>>> Stashed changes
export { 
  UserError, 
  ServerError, 
  GoogleAuthError,
<<<<<<< Updated upstream
} from './error'
=======
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
>>>>>>> Stashed changes
