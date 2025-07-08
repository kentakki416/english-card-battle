import { useState } from 'react'

interface ApiResponse {
  data?: {
    token: string
    user: {
      createdAt: string
      email: string
      id: string
      name: string
      profilePic?: string
      providerId: string
      providerType: string
      updatedAt: string
    }
  }
  error?: string
  message?: string
  success: boolean
}

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ApiResponse | null>(null)

  const callGoogleLogin = async (accessToken: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:8080/auth/login/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    data,
    callGoogleLogin,
  }
} 
