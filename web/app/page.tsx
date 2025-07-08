import Link from 'next/link'

import { CommonLayout } from '@/components/layout'

const HomePage = () => {
  return (
    <CommonLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              English Card Battle
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              楽しく英語を学ぼう！
            </p>
            
            {/* APIテストセクション */}
            <div className="max-w-md mx-auto mb-8 p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                API通信テスト
              </h2>
            </div>
            
            <div className="space-x-4">
              <Link 
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                href="/login" 
              >
                ログイン
              </Link>
              <Link 
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors"
                href="/signup" 
              >
                新規登録
              </Link>
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  )
}

export default HomePage 
