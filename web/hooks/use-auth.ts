import { useSession, signIn, signOut } from 'next-auth/react'

export const useAuth = () => {
  const { data: session, status } = useSession()

  return {
    session,
    status,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    login,
    logout,
  }
} 

/**
 * ログイン
 * @param provider プロバイダー
 */
const login = async (provider: string) => {
  await signIn(provider, { callbackUrl: '/' })
}

/**
 * ログアウト
 */
const logout = async () => {
  await signOut({ callbackUrl: '/' })
}
