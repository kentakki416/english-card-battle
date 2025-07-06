import Link from 'next/link'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            English Card Battle
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            楽しく英語を学ぼう！
          </p>
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
  )
}

export default HomePage 
