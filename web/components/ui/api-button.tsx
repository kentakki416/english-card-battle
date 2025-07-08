'use client'

import { Button } from './button'
import { useApi } from '../../hooks/use-api'

export const ApiButton = () => {
  const { loading, error, data, callHelloApi } = useApi()

  return (
    <div className="space-y-4">
      <Button 
        onClick={callHelloApi}
        disabled={loading}
        className="w-full"
      >
        {loading ? '通信中...' : 'APIを呼び出す'}
      </Button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">エラー: {error}</p>
        </div>
      )}

      {data && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-green-800 font-medium mb-2">レスポンス:</h3>
          <pre className="text-green-700 text-sm whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 
