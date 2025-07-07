/**
 * Googleログイン関連のController型定義
 */

/**
 * Googleログインリクエスト
 */
export interface GoogleLoginRequest {
  accessToken: string
}

/**
 * Googleログインレスポンス
 */
export interface GoogleLoginResponse {
  user: {
    id: string
    name: string
    email: string
    profilePic?: string
    providerType: string
    providerId: string
    createdAt: string
    updatedAt: string
  }
  token: string
}

/**
 * Googleログインエラーレスポンス
 */
export interface GoogleLoginErrorResponse {
  status: number
  message: string
  errorCode?: number
  responsedAt: Date
} 
