import { useState } from 'react'

interface ApiResponse {
  success: boolean
  data?: {
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
  error?: string
  message?: string
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
