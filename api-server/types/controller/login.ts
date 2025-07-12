/**
 * login APIのリクエストボディ
 */
export type LoginRequest = {
  userId: string,
  email: string,
  name: string,
  picture: string
}

export type LoginResponse = {
  id: string
  name: string
  gender: string
  profilePic: string
}
