
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

// NextAuth.jsの設定をインポート
import { authOptions } from '../[...nextauth]/route'

async function verifyGoogleToken(accessToken: string) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
  
  if (!response.ok) {
    throw new Error('Invalid Google token')
  }
  
  return response.json()
}

export async function POST() {
  try {
    // サーバー側でセッションを取得（JWEが自動復号化）
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }
    
    // Googleトークンの検証
    const googleUser = await verifyGoogleToken(session.accessToken)
    
    // アプリケーションサーバーに検証済みユーザー情報とセッショントークンを送信
    const appResponse = await fetch(`${process.env.API_SERVER_URL}/auth/google/login`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
        'X-Auth-Provider': 'google',  // 認証プロバイダー
        'X-Auth-Status': 'verified',  // 認証状態
      },
      body: JSON.stringify({
        userId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture
      })
    })
    
    if (!appResponse.ok) {
      return NextResponse.json({ error: 'Failed to authenticate with app server' }, { status: 500 })
    }
    
    const appToken = await appResponse.json()
    
    // アプリケーションJWTをCookieに保存
    cookies().set('app_token', appToken.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7日
    })
    
    return NextResponse.json({ 
      success: true,
      user: {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name
      }
    })
    
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Google verification error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
} 
