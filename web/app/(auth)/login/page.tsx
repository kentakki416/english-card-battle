"use client"

import { useState } from "react"

import Link from "next/link"

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    // ログイン処理
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">ログイン</h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            メールアドレス
                    </label>
                    <input
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        id="email"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        type="email"
                        value={formData.email}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            パスワード
                    </label>
                    <input
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        id="password"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        type="password"
                        value={formData.password}
                    />
                </div>
                <button
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    type="submit"
                >
          ログイン
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
        アカウントをお持ちでない方は{" "}
                <Link className="text-indigo-600 hover:text-indigo-500" href="/signup">
          新規登録
                </Link>
            </p>
        </div>
    )
}

export default LoginPage 
