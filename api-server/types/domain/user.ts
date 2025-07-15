/**
 * 認証で使用するプロバイダーの種類
 */
export type ProviderType = "google" | "github"

/**
 * プロバイダーのユーザー情報
 */
export type ProviderUserInfo = {
  google: {
    id: string
    name: string
    email: string
    picture?: string
  }
}
