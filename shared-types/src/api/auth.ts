import { z } from 'zod'

/**
 * ===== Login API =====
 */

/**
 * Login APIのリクエストスキーマ
 */
export const LoginRequestSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string()
})

/**
 * Login APIのレスポンススキーマ
 */
export const LoginResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  gender: z.string(),
  profilePic: z.string()
})

/**
 * 型推論
 */
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>

/**
 * ===== Google Login API =====
 */

/**
 * Googleログインリクエストスキーマ
 */
export const GoogleLoginRequestSchema = z.object({
  accessToken: z.string()
})

/**
 * Googleログインレスポンススキーマ
 */
export const GoogleLoginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    profilePic: z.string().optional(),
    providerType: z.string(),
    providerId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
  }),
  token: z.string()
})

/**
 * Googleログインエラーレスポンススキーマ
 */
export const GoogleLoginErrorResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  errorCode: z.number().optional(),
  responsedAt: z.date()
})

/**
 * 型推論
 */
export type GoogleLoginRequest = z.infer<typeof GoogleLoginRequestSchema>
export type GoogleLoginResponse = z.infer<typeof GoogleLoginResponseSchema>
export type GoogleLoginErrorResponse = z.infer<typeof GoogleLoginErrorResponseSchema>

/**
 * ===== Signup API =====
 */

/**
 * Signup APIのリクエストスキーマ
 */
export const SignupRequestSchema = z.object({
  name: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
  gender: z.string()
})

/**
 * Signup APIのレスポンススキーマ
 */
export const SignupResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  gender: z.string(),
  profilePic: z.string()
})

/**
 * 型推論
 */
export type SignupRequest = z.infer<typeof SignupRequestSchema>
export type SignupResponse = z.infer<typeof SignupResponseSchema>

