# Next.js 15 / React 19 コーディング規約

このドキュメントは、Next.js初心者でも理解できるように、実践的なコーディング規約をまとめたものです。

## 📁 1. ディレクトリ構成の基本ルール

### 1.1 App Routerの構造

```
apps/web/
├── app/                    # ルートディレクトリ（ここがベース）
│   ├── layout.tsx         # 全体のレイアウト（必須）
│   ├── page.tsx           # トップページ（必須）
│   ├── globals.css        # グローバルスタイル
│   │
│   ├── (main)/            # Route Group: URLには含まれない論理的なグループ
│   │   ├── layout.tsx     # このグループ専用のレイアウト
│   │   └── learn/
│   │       └── page.tsx   # URL: /learn
│   │
│   ├── (market)/          # Route Group: マーケティングページ用
│   │   ├── layout.tsx
│   │   ├── page.tsx       # URL: /
│   │   └── Header.tsx     # このグループ専用のコンポーネント
│   │
│   └── api/               # API Routes
│       └── auth/
│           └── route.ts   # URL: /api/auth
│
├── components/            # 再利用可能なコンポーネント
│   ├── layout/            # レイアウト関連
│   └── ui/                # UI部品
│
└── lib/                   # ユーティリティ関数
```

### 1.2 重要な特殊ファイル

| ファイル名 | 役割 | 必須 |
|----------|------|------|
| `layout.tsx` | ページを囲むレイアウト | ✅ ルートは必須 |
| `page.tsx` | 実際のページ内容 | ✅ ページごとに必須 |
| `loading.tsx` | ローディングUI | ❌ オプション |
| `error.tsx` | エラーハンドリング | ❌ オプション |
| `not-found.tsx` | 404ページ | ❌ オプション |
| `route.ts` | APIエンドポイント | ❌ API作成時のみ |

### 1.3 フォルダ命名規則

```
app/
├── (marketing)/        # Route Group: URLに含まれない（丸括弧）
├── _components/        # プライベートフォルダ: ルーティング対象外（アンダースコア）
├── dashboard/          # 通常のフォルダ: URL /dashboard
└── [id]/              # 動的ルート: URL /123, /456 など
```

**ポイント:**
- `()` = Route Group（URLには含まれず、論理的なグループ分けのみ）
- `_` = プライベートフォルダ（ルーティングから完全に除外）
- `[]` = 動的パラメータ

## 🎨 2. コンポーネント設計

### 2.1 Server Component と Client Component

**Next.js 15/React 19 の最重要概念！**

#### デフォルトは Server Component

```tsx
// app/page.tsx
// ⭐ デフォルトでServer Component（"use client"なし）
const HomePage = async () => {
  // サーバー側で実行される
  const data = await fetch('https://api.example.com/data')
  
  return <div>{data.title}</div>
}

export default HomePage
```

**Server Componentのメリット:**
- データベースに直接アクセス可能
- APIキーなどの機密情報を安全に扱える
- バンドルサイズが小さい（JavaScriptをクライアントに送らない）

#### Client Component が必要な場合

```tsx
// components/Counter.tsx
'use client' // ⭐ この1行でClient Componentになる

import { useState } from 'react'

const Counter = () => {
  // クライアント側で実行される
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}

export default Counter
```

**Client Componentが必要な場合:**
- `useState`, `useEffect` などのReact Hooksを使う
- `onClick` などのイベントハンドラを使う
- ブラウザAPIを使う（`window`, `localStorage` など）
- インタラクティブな操作が必要

### 2.2 コンポーネントの使い分け指針

```
┌─────────────────────────────────────────┐
│ 質問: このコンポーネントは...           │
└─────────────────────────────────────────┘
              ↓
    ┌─────────────────────┐
    │ 状態を持つ？         │
    │ クリックイベント？   │  → YES → Client Component
    │ ユーザー入力を受ける？│
    └─────────────────────┘
              ↓ NO
    ┌─────────────────────┐
    │ データ取得だけ？     │
    │ 静的な表示だけ？     │  → YES → Server Component（デフォルト）
    └─────────────────────┘
```

### 2.3 コンポーネントの構成例

```tsx
// ✅ 推奨: Server Componentでデータ取得 → Client Componentに渡す

// app/dashboard/page.tsx（Server Component）
const DashboardPage = async () => {
  const data = await fetchUserData() // サーバー側で実行
  
  return (
    <div>
      <h1>ダッシュボード</h1>
      <UserProfile data={data} /> {/* Client Componentに渡す */}
    </div>
  )
}

// components/UserProfile.tsx（Client Component）
'use client'

const UserProfile = ({ data }: { data: User }) => {
  const [isEditing, setIsEditing] = useState(false)
  
  return (
    <div>
      <p>{data.name}</p>
      <button onClick={() => setIsEditing(true)}>編集</button>
    </div>
  )
}
```

## 📝 3. 命名規則

### 3.1 ファイル命名

| 種類 | 命名規則 | 例 |
|------|---------|-----|
| コンポーネント | PascalCase | `UserProfile.tsx` |
| ページファイル | 固定名 | `page.tsx`, `layout.tsx` |
| APIルート | 固定名 | `route.ts` |
| ユーティリティ | kebab-case | `format-date.ts` |
| 型定義 | kebab-case | `user-types.ts` |

### 3.2 変数・関数命名

```tsx
// ✅ 推奨
const userName = 'John'              // camelCase
const UserProfile = () => {}         // コンポーネントはPascalCase
const fetchUserData = async () => {} // 関数はcamelCase

// ❌ 非推奨
const user_name = 'John'    // snake_case（使わない）
const FETCH_DATA = () => {}  // 定数関数以外でALL_CAPS（使わない）
```

## 🔄 4. データ取得のパターン

### 4.1 Server Componentでのデータ取得

```tsx
// ✅ Server Componentで直接fetch（推奨）
const PostsPage = async () => {
  const posts = await fetch('https://api.example.com/posts')
    .then(res => res.json())
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

### 4.2 Client Componentでのデータ取得

```tsx
'use client'

import { useEffect, useState } from 'react'

const PostsList = () => {
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])
  
  return <div>{/* ... */}</div>
}
```

## 🎯 5. TypeScript の型定義

### 5.1 Props の型定義

```tsx
// ✅ 推奨: インラインでシンプルな型定義
const Button = ({ label, onClick }: { 
  label: string
  onClick: () => void 
}) => {
  return <button onClick={onClick}>{label}</button>
}

// ✅ 推奨: 複雑な場合は型を分離
type UserCardProps = {
  user: {
    id: string
    name: string
    email: string
  }
  onEdit: (id: string) => void
  isEditable?: boolean // オプショナル
}

const UserCard = ({ user, onEdit, isEditable = false }: UserCardProps) => {
  return <div>{/* ... */}</div>
}
```

## 🚀 6. パフォーマンス最適化

### 6.1 画像の最適化

```tsx
import Image from 'next/image'

// ✅ 推奨: next/image を使用
const Avatar = () => {
  return (
    <Image
      src="/avatar.png"
      alt="ユーザーアバター"
      width={100}
      height={100}
      priority // 重要な画像には priority を指定
    />
  )
}

// ❌ 非推奨: 通常の img タグ
const Avatar = () => {
  return <img src="/avatar.png" alt="アバター" />
}
```

### 6.2 動的インポート

```tsx
// ✅ 推奨: 重いコンポーネントは動的インポート
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <p>読み込み中...</p>,
  ssr: false // クライアント側のみで実行
})

const Dashboard = () => {
  return (
    <div>
      <h1>ダッシュボード</h1>
      <HeavyChart />
    </div>
  )
}
```

## 🔒 7. 環境変数とセキュリティ

### 7.1 環境変数の命名

```bash
# .env.local

# ⭐ サーバー側のみで使用（機密情報）
DATABASE_URL="postgresql://..."
API_SECRET_KEY="secret123"

# ⭐ クライアント側でも使用（NEXT_PUBLIC_ プレフィックス必須）
NEXT_PUBLIC_API_URL="https://api.example.com"
NEXT_PUBLIC_SITE_NAME="English Card Battle"
```

### 7.2 使用方法

```tsx
// Server Component（サーバー側のみ）
const ServerComponent = () => {
  const dbUrl = process.env.DATABASE_URL // OK
  const apiKey = process.env.API_SECRET_KEY // OK
  return <div>...</div>
}

// Client Component
'use client'

const ClientComponent = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL // OK
  const dbUrl = process.env.DATABASE_URL // ❌ undefined（アクセス不可）
  return <div>...</div>
}
```

## 📋 8. その他のベストプラクティス

### 8.1 メタデータの定義

```tsx
// app/layout.tsx または page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'English Card Battle',
  description: '楽しく英語を学ぼう！',
  openGraph: {
    title: 'English Card Battle',
    description: '楽しく英語を学ぼう！',
    images: ['/og-image.png'],
  },
}
```

### 8.2 エラーハンドリング

```tsx
// app/dashboard/error.tsx
'use client' // error.tsxは必ずClient Component

const Error = ({ 
  error, 
  reset 
}: { 
  error: Error
  reset: () => void 
}) => {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <p>{error.message}</p>
      <button onClick={reset}>再試行</button>
    </div>
  )
}

export default Error
```

### 8.3 ローディング状態

```tsx
// app/dashboard/loading.tsx
const Loading = () => {
  return (
    <div>
      <p>読み込み中...</p>
    </div>
  )
}

export default Loading
```

## 🎓 9. まとめ: 覚えておくべき3つの重要ポイント

### ✅ 1. デフォルトはServer Component
- 何も書かなければServer Component
- 状態やイベントが必要なときだけ `'use client'`

### ✅ 2. ファイル名は重要
- `page.tsx` = ページ
- `layout.tsx` = レイアウト
- `route.ts` = API

### ✅ 3. 型定義を忘れずに
- Propsには必ず型をつける
- TypeScriptを活用する

## 📚 参考リンク

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [React 19 ドキュメント](https://react.dev/)
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/)

---

**更新日:** 2025-11-11  
**対象バージョン:** Next.js 15.x, React 19.x



