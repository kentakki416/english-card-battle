import { useState } from 'react'

interface ApiResponse {
  message: string
  timestamp: string
  method?: string
}

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ApiResponse | null>(null)

  const callHelloApi = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:8080/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    callHelloApi,
  }
} 
