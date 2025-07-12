/**
 * signUpのリクエストボディの型
 */
export type SignupRequest = {
  name: string
  password: string
  confirmPassword: string,
  gender: string
}

/**
 * signUpのレスポンスボディの型
 */
export type SignupResponse = {
  id: string
  name: string
  gender: string
  profilePic: string
}
