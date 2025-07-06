# Google認証 クライアント実装

## 必要なライブラリ
```bash
npm install next-auth
```

## 基本的な実装

### 1. NextAuth.js設定
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // バックエンドAPIに認証情報を送信
      if (account) {
        const response = await fetch(`${process.env.API_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'google',
            accessToken: account.access_token,
          }),
        });
        return response.ok;
      }
      return false;
    },
  },
});

export { handler as GET, handler as POST };
```

### 2. ログインボタン
```typescript
// app/signup/page.tsx
'use client';

import { signIn } from 'next-auth/react';

export default function SignupPage() {
  const handleGoogleSignup = async () => {
    await signIn('google', {
      callbackUrl: '/dashboard',
    });
  };

  return (
    <button onClick={handleGoogleSignup}>
      Googleでログイン
    </button>
  );
}
```

### 3. セッション管理
```typescript
// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

## 環境変数
```env
# .env.local
GOOGLE_OAUTH_CLIENT_ID=your_oauth2_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_oauth2_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
API_BASE_URL=http://localhost:3001
```

## 認証フロー
1. ユーザーがログインボタンをクリック
2. NextAuth.jsがGoogle認証ページにリダイレクト
3. ユーザーがGoogleでログイン
4. Googleが認証コードを返す
5. NextAuth.jsがバックエンドに認証情報を送信
6. バックエンドがユーザー情報を処理
7. ログイン完了 
