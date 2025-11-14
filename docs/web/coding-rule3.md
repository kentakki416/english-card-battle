# Next.js 15 / React 19 データ取得ガイド

第3章: データ取得の実践的なベストプラクティス

参考: [Next.js 15 / React 19 実践設計ガイド - 第3章](https://zenn.dev/k_mori/books/24320553af0956/viewer/b4ef68)

## 📡 1. データ取得の基本原則

### 1.1 Server Component でのデータ取得を優先

**基本方針:**
- できる限り Server Component でデータを取得
- データベースやAPIへの直接アクセスが可能
- クライアントにデータ取得ロジックを送る必要がない

```tsx
// ✅ 推奨: Server Component でデータ取得
// app/posts/page.tsx
const PostsPage = async () => {
  // サーバー側で直接データ取得
  const posts = await fetch('https://api.example.com/posts')
    .then(res => res.json())
  
  return (
    <div>
      <h1>記事一覧</h1>
      <PostList posts={posts} />
    </div>
  )
}

export default PostsPage
```

### 1.2 データ取得の場所による分類

| 取得場所 | 使用するコンポーネント | 使用ケース |
|---------|---------------------|-----------|
| サーバー側 | Server Component | 初期表示データ、SEO対策、セキュアなデータ |
| クライアント側 | Client Component | ユーザー操作後、リアルタイムデータ、動的更新 |

## 🚀 2. Server Component でのデータ取得

### 2.1 基本的な fetch の使い方

```tsx
// ✅ 基本パターン
const BlogPost = async ({ id }: { id: string }) => {
  const post = await fetch(`https://api.example.com/posts/${id}`)
    .then(res => res.json())
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

### 2.2 fetch のキャッシュオプション

#### force-cache（デフォルト）

```tsx
// ✅ 静的データ: キャッシュを使用（デフォルト）
const StaticData = async () => {
  const data = await fetch('https://api.example.com/static', {
    cache: 'force-cache'  // デフォルト値（省略可能）
  }).then(res => res.json())
  
  return <div>{data.title}</div>
}
```

**特徴:**
- ビルド時に一度だけ取得
- 最高のパフォーマンス
- 静的なデータに最適

#### no-store（動的データ）

```tsx
// ✅ 動的データ: キャッシュを使用しない
const DynamicData = async () => {
  const data = await fetch('https://api.example.com/dynamic', {
    cache: 'no-store'  // 毎回新しいデータを取得
  }).then(res => res.json())
  
  return <div>{data.title}</div>
}
```

**特徴:**
- リクエストごとに毎回取得
- 常に最新のデータ
- ユーザー固有のデータに最適

#### revalidate（定期更新）

```tsx
// ✅ 定期更新: 指定時間後にキャッシュを更新
const RevalidatedData = async () => {
  const data = await fetch('https://api.example.com/news', {
    next: { revalidate: 3600 }  // 1時間ごとに再検証
  }).then(res => res.json())
  
  return <div>{data.title}</div>
}
```

**特徴:**
- 指定した秒数後にキャッシュを更新
- パフォーマンスと鮮度のバランス
- ニュース、ブログ記事などに最適

### 2.3 キャッシュ戦略の選び方

```
データの性質を判断
    ↓
┌─────────────────────────┐
│ データは変更される？     │
└─────────────────────────┘
    ↓ NO              ↓ YES
force-cache      ┌─────────────────────────┐
（デフォルト）    │ どのくらいの頻度で？     │
                └─────────────────────────┘
                    ↓                ↓
                高頻度            低〜中頻度
                no-store         revalidate
```

### 2.4 エラーハンドリング

```tsx
// ✅ 推奨: try-catch でエラーを処理
const SafeDataFetch = async () => {
  try {
    const data = await fetch('https://api.example.com/data')
    
    if (!data.ok) {
      throw new Error('データの取得に失敗しました')
    }
    
    const result = await data.json()
    return <div>{result.title}</div>
  } catch (error) {
    // エラーハンドリング
    return (
      <div className="error">
        <p>データの取得に失敗しました</p>
        <p>{error instanceof Error ? error.message : '不明なエラー'}</p>
      </div>
    )
  }
}
```

```tsx
// ✅ より良い方法: error.tsx を使用
// app/posts/error.tsx
'use client'

const Error = ({ error, reset }: { error: Error, reset: () => void }) => {
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

## 🔄 3. 並列データ取得と直列データ取得

### 3.1 並列データ取得（推奨）

```tsx
// ✅ 推奨: Promise.all で並列取得
const ParallelFetch = async () => {
  // 複数のデータを同時に取得
  const [posts, users, comments] = await Promise.all([
    fetch('https://api.example.com/posts').then(res => res.json()),
    fetch('https://api.example.com/users').then(res => res.json()),
    fetch('https://api.example.com/comments').then(res => res.json()),
  ])
  
  return (
    <div>
      <PostList posts={posts} />
      <UserList users={users} />
      <CommentList comments={comments} />
    </div>
  )
}
```

**メリット:**
- 最も速い（同時に取得）
- 依存関係がない場合に最適

### 3.2 直列データ取得（依存関係がある場合）

```tsx
// ✅ 直列取得: データに依存関係がある場合
const SequentialFetch = async () => {
  // 1. まずユーザー情報を取得
  const user = await fetch('https://api.example.com/user/1')
    .then(res => res.json())
  
  // 2. ユーザーのIDを使って投稿を取得
  const posts = await fetch(`https://api.example.com/posts?userId=${user.id}`)
    .then(res => res.json())
  
  return (
    <div>
      <UserProfile user={user} />
      <PostList posts={posts} />
    </div>
  )
}
```

**使用ケース:**
- 後のリクエストが前のレスポンスに依存する場合

### 3.3 部分的な並列化

```tsx
// ✅ ベストプラクティス: 依存関係を考慮して最適化
const OptimizedFetch = async () => {
  // ステップ1: 独立したデータを並列取得
  const [user, categories] = await Promise.all([
    fetch('https://api.example.com/user/1').then(res => res.json()),
    fetch('https://api.example.com/categories').then(res => res.json()),
  ])
  
  // ステップ2: ユーザー依存のデータを並列取得
  const [posts, favorites] = await Promise.all([
    fetch(`https://api.example.com/posts?userId=${user.id}`).then(res => res.json()),
    fetch(`https://api.example.com/favorites?userId=${user.id}`).then(res => res.json()),
  ])
  
  return (
    <div>
      <UserProfile user={user} />
      <Categories categories={categories} />
      <PostList posts={posts} />
      <FavoriteList favorites={favorites} />
    </div>
  )
}
```

## ⚡ 4. Streaming と Suspense

### 4.1 Suspense でローディング状態を管理

```tsx
// app/posts/page.tsx
import { Suspense } from 'react'

const PostsPage = () => {
  return (
    <div>
      <h1>記事一覧</h1>
      
      {/* Suspense でラップすると、データ取得中に loading.tsx が表示される */}
      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
      
      <Suspense fallback={<CommentListSkeleton />}>
        <CommentList />
      </Suspense>
    </div>
  )
}

// データ取得コンポーネント
const PostList = async () => {
  const posts = await fetch('https://api.example.com/posts')
    .then(res => res.json())
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### 4.2 loading.tsx の活用

```tsx
// app/posts/loading.tsx
const Loading = () => {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  )
}

export default Loading
```

**自動的な動作:**
- Server Component がデータを取得している間
- `loading.tsx` が自動的に表示される
- データ取得完了後、実際のコンテンツに置き換わる

## 💻 5. Client Component でのデータ取得

### 5.1 useEffect + fetch パターン

```tsx
// ✅ 基本パターン
'use client'

import { useEffect, useState } from 'react'

const ClientDataFetch = () => {
  const [data, setData] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    fetch('https://api.example.com/posts')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return (
    <ul>
      {data.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### 5.2 SWR の使用（推奨）

```tsx
// ✅ 推奨: SWR を使用
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const PostList = () => {
  const { data, error, isLoading } = useSWR(
    'https://api.example.com/posts',
    fetcher
  )
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return (
    <ul>
      {data.map((post: Post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

**SWR のメリット:**
- 自動キャッシュ
- 自動再検証
- フォーカス時の再取得
- インターバル再取得
- 楽観的更新

### 5.3 React Query の使用

```tsx
// ✅ React Query を使用
'use client'

import { useQuery } from '@tanstack/react-query'

const PostList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('https://api.example.com/posts')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return (
    <ul>
      {data.map((post: Post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## 🎯 6. データ取得のベストプラクティス

### 6.1 適切な取得方法の選択

```
データ取得を検討
    ↓
┌─────────────────────────────┐
│ 初期表示に必要？             │
└─────────────────────────────┘
    ↓ YES              ↓ NO
Server Component    Client Component
    ↓                   ↓
┌─────────────┐      ┌─────────────┐
│ データの性質 │      │ ユーザー操作後│
└─────────────┘      │ リアルタイム  │
    ↓                │ 認証必要     │
静的 → force-cache   └─────────────┘
動的 → no-store           ↓
定期 → revalidate    useEffect
                    SWR
                    React Query
```

### 6.2 パフォーマンス最適化

#### 1. 必要最小限のデータのみ取得

```tsx
// ❌ 悪い例: 不要なデータも取得
const BadExample = async () => {
  const users = await fetch('https://api.example.com/users?include=all')
    .then(res => res.json())
  
  // name だけ使うのに、全データを取得している
  return <div>{users.map(u => u.name)}</div>
}

// ✅ 良い例: 必要なフィールドだけ取得
const GoodExample = async () => {
  const users = await fetch('https://api.example.com/users?fields=id,name')
    .then(res => res.json())
  
  return <div>{users.map(u => u.name)}</div>
}
```

#### 2. ページネーションの実装

```tsx
// ✅ ページネーション
const PostList = async ({ page = 1 }: { page?: number }) => {
  const limit = 20
  const offset = (page - 1) * limit
  
  const posts = await fetch(
    `https://api.example.com/posts?limit=${limit}&offset=${offset}`
  ).then(res => res.json())
  
  return (
    <div>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <Pagination currentPage={page} />
    </div>
  )
}
```

#### 3. 無限スクロール

```tsx
// ✅ 無限スクロール (Client Component)
'use client'

import { useEffect, useState } from 'react'

const InfiniteScroll = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  const loadMore = async () => {
    const newPosts = await fetch(
      `https://api.example.com/posts?page=${page}&limit=20`
    ).then(res => res.json())
    
    if (newPosts.length === 0) {
      setHasMore(false)
    } else {
      setPosts([...posts, ...newPosts])
      setPage(page + 1)
    }
  }
  
  useEffect(() => {
    loadMore()
  }, [])
  
  return (
    <div>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      {hasMore && (
        <button onClick={loadMore}>もっと読み込む</button>
      )}
    </div>
  )
}
```

### 6.3 型安全性の確保

```tsx
// ✅ 推奨: Zod で型検証
import { z } from 'zod'

// スキーマ定義
const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
})

const PostListSchema = z.array(PostSchema)

type Post = z.infer<typeof PostSchema>

const SafeFetch = async () => {
  const response = await fetch('https://api.example.com/posts')
  const data = await response.json()
  
  // 型検証
  const posts = PostListSchema.parse(data)
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## 🔐 7. セキュリティとエラーハンドリング

### 7.1 環境変数の使用

```tsx
// ✅ 推奨: 環境変数で API URL を管理
const API_URL = process.env.NEXT_PUBLIC_API_URL

const fetchPosts = async () => {
  const posts = await fetch(`${API_URL}/posts`)
    .then(res => res.json())
  
  return posts
}
```

### 7.2 タイムアウトの設定

```tsx
// ✅ タイムアウトを設定
const fetchWithTimeout = async (url: string, timeout = 5000) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('リクエストがタイムアウトしました')
    }
    throw error
  }
}
```

### 7.3 リトライロジック

```tsx
// ✅ リトライロジックの実装
const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  maxRetries = 3
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options)
      if (response.ok) return response
      
      // 最後の試行でなければリトライ
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        continue
      }
      
      throw new Error(`HTTP error! status: ${response.status}`)
    } catch (error) {
      if (i === maxRetries - 1) throw error
    }
  }
}
```

## 📝 8. まとめ: データ取得のチェックリスト

### ✅ 設計時

- [ ] Server Component でデータ取得できないか検討したか？
- [ ] データの性質に応じたキャッシュ戦略を選んだか？
- [ ] 並列取得できるデータはないか？
- [ ] 必要最小限のデータだけ取得しているか？

### ✅ 実装時

- [ ] エラーハンドリングを実装したか？
- [ ] ローディング状態を適切に表示しているか？
- [ ] タイムアウトを設定したか？
- [ ] 型安全性を確保したか？

### ✅ 最適化

- [ ] キャッシュを適切に活用しているか？
- [ ] 不要な再取得を防いでいるか？
- [ ] ページネーションや無限スクロールを実装したか？
- [ ] パフォーマンスを計測したか？

## 📚 参考リンク

- [Zenn - Next.js 15 / React 19 実践設計ガイド 第3章](https://zenn.dev/k_mori/books/24320553af0956/viewer/b4ef68)
- [Next.js - Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js - Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [SWR Documentation](https://swr.vercel.app/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

---

**更新日:** 2025-11-11  
**対象バージョン:** Next.js 15.x, React 19.x



