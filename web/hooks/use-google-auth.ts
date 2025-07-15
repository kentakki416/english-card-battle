import { useEffect, useRef } from "react"

import { useSession } from "next-auth/react"

export const useGoogleAuth = () => {
  const { data: session, status } = useSession()
  const hasCalledApi = useRef(false)

  useEffect(() => {
    // 認証済みでトークンがあり、まだAPIを呼んでいない場合のみ実行
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (status === "authenticated" && (session as any)?.accessToken && !hasCalledApi.current) {
      hasCalledApi.current = true
      
      // Next.js Route HandlerでGoogleトークンを検証
      fetch("/api/auth/verify-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error("Google auth verification error:", error)
      })
    }
  }, [status, session])

  return { session, status }
} 
