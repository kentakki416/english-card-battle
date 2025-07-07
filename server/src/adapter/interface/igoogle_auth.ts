import { Result, UserError, ServerError } from '../../../types'
import { GoogleAuthError } from '../../../types/error'

export interface GoogleUserInfo {
  id: string
  email: string
  name: string
  picture?: string
}

export interface IGoogleAuth {
  verifyToken(accessToken: string): Promise<Result<GoogleUserInfo, UserError | ServerError | GoogleAuthError>>
} 
