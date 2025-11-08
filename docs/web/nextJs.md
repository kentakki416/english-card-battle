# Next.js 15 / React 19 コーディング規約

本ドキュメントは、Next.js 15およびReact 19を用いた開発におけるコーディング規約です。新しくジョインするエンジニアがこの規約を参照することで、スムーズに開発を進められるよう、実践的なベストプラクティスを網羅しています。

**参考資料:**
- [第1章: 基本ルールとディレクトリ構成](https://zenn.dev/k_mori/books/24320553af0956/viewer/2808af)
- [第2章: コンポーネント設計](https://zenn.dev/k_mori/books/24320553af0956/viewer/6b1ab8)
- [第3章: データ取得](https://zenn.dev/k_mori/books/24320553af0956/viewer/b4ef68)
- [第4章: データ更新](https://zenn.dev/k_mori/books/24320553af0956/viewer/9bce66)
- [第5章: 状態管理](https://zenn.dev/k_mori/books/24320553af0956/viewer/714dcb)
- [第6章: キャッシュ戦略](https://zenn.dev/k_mori/books/24320553af0956/viewer/c862c6)
- [第7章: エラーハンドリング](https://zenn.dev/k_mori/books/24320553af0956/viewer/8cbd0d)

---

## 目次

1. [基本ルールとディレクトリ構成](#1-基本ルールとディレクトリ構成)
2. [コンポーネント設計](#2-コンポーネント設計)
3. [データ取得](#3-データ取得)
4. [データ更新](#4-データ更新)
5. [状態管理](#5-状態管理)
6. [キャッシュ戦略](#6-キャッシュ戦略)
7. [エラーハンドリング](#7-エラーハンドリング)
8. [パフォーマンス最適化](#8-パフォーマンス最適化)
9. [型安全性とTypeScript](#9-型安全性とtypescript)
10. [テスト](#10-テスト)

---

## 1. 基本ルールとディレクトリ構成

### 1.1 プロジェクト構造

Next.js 15ではApp Routerを使用することを推奨します。以下のディレクトリ構成に従ってください。

```
/app                    # App Router（推奨）
  /(main)              # ルートグループ（レイアウト共有）
  /(auth)              # 認証関連のルートグループ
  /api                 # APIルート
  layout.tsx           # ルートレイアウト
  page.tsx             # ホームページ
  error.tsx            # エラーページ
  loading.tsx          # ローディングUI
  not-found.tsx        # 404ページ

/components            # 再利用可能なコンポーネント
  /ui                  # 基本的なUIコンポーネント
  /layout              # レイアウトコンポーネント
  /feature             # 機能別コンポーネント

/lib                   # ユーティリティ関数
  /api                 # API通信ロジック
  /utils               # 汎用ユーティリティ
  /validators          # バリデーションロジック

/hooks                 # カスタムフック
/contexts              # Reactコンテキスト
/types                 # TypeScript型定義
/constants             # 定数定義
/styles                # グローバルスタイル
/public                # 静的ファイル
/tests                 # テストコード
```

### 1.2 命名規則

#### ファイル名
- **コンポーネントファイル**: PascalCase（例: `UserProfile.tsx`）
- **ユーティリティファイル**: kebab-case（例: `format-date.ts`）
- **フックファイル**: kebab-case with `use-` prefix（例: `use-user-data.ts`）
- **Next.js特殊ファイル**: 小文字（例: `page.tsx`, `layout.tsx`, `error.tsx`）

#### コード内の命名
- **コンポーネント名**: PascalCase（例: `UserProfile`）
- **関数名**: camelCase（例: `fetchUserData`）
- **変数名**: camelCase（例: `userData`）
- **定数名**: UPPER_SNAKE_CASE（例: `API_BASE_URL`）
- **型名**: PascalCase（例: `UserData`, `ApiResponse`）

### 1.3 基本ルール

1. **TypeScriptを使用する**: すべての新規ファイルは`.tsx`または`.ts`拡張子を使用
2. **厳格モードを有効化**: `tsconfig.json`で`strict: true`を設定
3. **ESLintとPrettierを使用**: コードの品質とフォーマットを統一
4. **絶対パスインポートを使用**: `@/`エイリアスを設定して可読性を向上

```typescript
// Good
import { Button } from '@/components/ui/Button'

// Avoid
import { Button } from '../../../components/ui/Button'
```

---

## 2. コンポーネント設計

### 2.1 Server ComponentとClient Componentの使い分け

#### Server Component（デフォルト）
App Router内のすべてのコンポーネントはデフォルトでServer Componentです。

**使用するケース:**
- データ取得が必要な場合
- SEOが重要な場合
- バックエンドリソースに直接アクセスする場合
- APIキーなどの秘密情報を扱う場合
- 大きな依存関係をサーバー側に保持したい場合

```typescript
// app/users/page.tsx
// Server Component（デフォルト）
async function UsersPage() {
  const users = await fetchUsers() // サーバー側でデータ取得
  
  return (
    <div>
      <h1>Users</h1>
      <UserList users={users} />
    </div>
  )
}

export default UsersPage
```

#### Client Component
`"use client"`ディレクティブを使用して明示的に宣言します。

**使用するケース:**
- インタラクティブ性が必要な場合（onClick, onChange等）
- Reactの状態（useState, useReducer）を使用する場合
- ライフサイクルエフェクト（useEffect）を使用する場合
- ブラウザAPIを使用する場合
- カスタムフックを使用する場合

```typescript
// components/ui/Button.tsx
'use client'

import { useState } from 'react'

export function Button({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleClick = () => {
    setIsLoading(true)
    // 処理...
  }
  
  return (
    <button onClick={handleClick} disabled={isLoading}>
      {children}
    </button>
  )
}
```

### 2.2 コンポーネント設計原則

#### 単一責任の原則
1つのコンポーネントは1つの責務のみを持つべきです。

```typescript
// Good: 責務が明確
function UserAvatar({ user }: { user: User }) {
  return <img src={user.avatar} alt={user.name} />
}

function UserName({ user }: { user: User }) {
  return <span>{user.name}</span>
}

function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <UserAvatar user={user} />
      <UserName user={user} />
    </div>
  )
}

// Avoid: 責務が多すぎる
function UserEverything({ user }: { user: User }) {
  // アバター、名前、設定、フォーム、すべてが混在...
}
```

#### コンポーネントの階層化

1. **Presentational Component（表示コンポーネント）**: UIの表示に特化
2. **Container Component（コンテナコンポーネント）**: データ取得と状態管理を担当
3. **Layout Component（レイアウトコンポーネント）**: ページ構造を定義

```typescript
// Presentational Component
function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="card">
      <h2>{user.name}</h2>
      <button onClick={onEdit}>Edit</button>
    </div>
  )
}

// Container Component
async function UserCardContainer({ userId }: { userId: string }) {
  const user = await fetchUser(userId)
  
  return <UserCard user={user} onEdit={() => {/* ... */}} />
}
```

### 2.3 Props設計

#### 型定義を明示する

```typescript
// Good
type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
}

function Button({ children, variant = 'primary', size = 'md', disabled, onClick }: ButtonProps) {
  // ...
}

// Avoid: 型定義なし
function Button(props) {
  // ...
}
```

#### 必要最小限のPropsを渡す

```typescript
// Good
function UserName({ name }: { name: string }) {
  return <span>{name}</span>
}

<UserName name={user.name} />

// Avoid: オブジェクト全体を渡す（不要な依存）
function UserName({ user }: { user: User }) {
  return <span>{user.name}</span>
}

<UserName user={user} />
```

---

## 3. データ取得

### 3.1 Server Componentでのデータ取得

Server Componentでは`async/await`を直接使用できます。

```typescript
// app/posts/page.tsx
async function PostsPage() {
  // サーバー側でデータ取得（自動でキャッシュされる）
  const posts = await fetchPosts()
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

export default PostsPage
```

### 3.2 データ取得の基本パターン

#### パターン1: fetch APIの使用（推奨）

```typescript
// lib/api/posts.ts
export async function fetchPosts() {
  const res = await fetch('https://api.example.com/posts', {
    // Next.js 15のデフォルトは no-store
    cache: 'force-cache', // またはno-store
    next: { revalidate: 3600 } // 1時間ごとに再検証
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  
  return res.json()
}
```

#### パターン2: 並列データ取得

```typescript
async function UserDashboard({ userId }: { userId: string }) {
  // 並列でデータ取得
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId)
  ])
  
  return (
    <div>
      <UserProfile user={user} />
      <UserPosts posts={posts} />
      <UserComments comments={comments} />
    </div>
  )
}
```

#### パターン3: データストリーミング（Suspense）

```typescript
// app/posts/page.tsx
import { Suspense } from 'react'

function PostsPage() {
  return (
    <div>
      <h1>Posts</h1>
      <Suspense fallback={<PostsSkeleton />}>
        <PostsList />
      </Suspense>
    </div>
  )
}

async function PostsList() {
  const posts = await fetchPosts()
  return <div>{/* posts表示 */}</div>
}
```

### 3.3 エラーハンドリング

```typescript
async function fetchUserSafely(userId: string) {
  try {
    const res = await fetch(`/api/users/${userId}`)
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    return await res.json()
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw error // error.tsxでキャッチされる
  }
}
```

### 3.4 Client Componentでのデータ取得

Client Componentでデータ取得が必要な場合は、SWRやReact Queryを使用します。

```typescript
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR(`/api/users/${userId}`, fetcher)
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>
  
  return <div>{data.name}</div>
}
```

---

## 4. データ更新

### 4.1 Server Actionsの使用（推奨）

Server Actionsは、フォーム送信やデータ更新に使用します。

```typescript
// app/actions/posts.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  // バリデーション
  if (!title || !content) {
    return { error: 'Title and content are required' }
  }
  
  try {
    // データベースに保存
    const post = await db.posts.create({
      data: { title, content }
    })
    
    // キャッシュの再検証
    revalidatePath('/posts')
    
    // リダイレクト
    redirect(`/posts/${post.id}`)
  } catch (error) {
    return { error: 'Failed to create post' }
  }
}
```

### 4.2 フォームの実装

#### Server Action with Form

```typescript
// app/posts/new/page.tsx
import { createPost } from '@/app/actions/posts'

function NewPostPage() {
  return (
    <form action={createPost}>
      <input type="text" name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  )
}
```

#### Client ComponentでのServer Action使用

```typescript
'use client'

import { createPost } from '@/app/actions/posts'
import { useFormState, useFormStatus } from 'react-dom'

const initialState = {
  error: null
}

export function PostForm() {
  const [state, formAction] = useFormState(createPost, initialState)
  
  return (
    <form action={formAction}>
      <input type="text" name="title" required />
      <textarea name="content" required />
      {state.error && <p className="error">{state.error}</p>}
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  )
}
```

### 4.3 楽観的UI更新

```typescript
'use client'

import { useOptimistic } from 'react'
import { likePost } from '@/app/actions/posts'

export function LikeButton({ postId, likes }: { postId: string, likes: number }) {
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(likes)
  
  const handleLike = async () => {
    setOptimisticLikes(optimisticLikes + 1)
    await likePost(postId)
  }
  
  return (
    <button onClick={handleLike}>
      ❤️ {optimisticLikes}
    </button>
  )
}
```

### 4.4 APIルートの使用

Server Actionsが使えない場合や、外部からのアクセスが必要な場合はAPIルートを使用します。

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // バリデーション
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Invalid data' },
        { status: 400 }
      )
    }
    
    // データ保存
    const post = await db.posts.create({ data: body })
    
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## 5. 状態管理

### 5.1 状態管理の階層

1. **URLステート**: 検索パラメータ、パス（最優先）
2. **Server State**: データベースから取得したデータ
3. **Local State**: コンポーネント内の状態（useState）
4. **Global State**: アプリケーション全体で共有する状態（Context, Zustand等）

### 5.2 URLステートの活用

検索、フィルタ、ページネーションなどはURLパラメータで管理します。

```typescript
// app/posts/page.tsx
type SearchParams = {
  query?: string
  page?: string
  sort?: string
}

async function PostsPage({ searchParams }: { searchParams: SearchParams }) {
  const query = searchParams.query || ''
  const page = Number(searchParams.page) || 1
  const sort = searchParams.sort || 'newest'
  
  const posts = await fetchPosts({ query, page, sort })
  
  return (
    <div>
      <SearchForm />
      <PostsList posts={posts} />
      <Pagination currentPage={page} />
    </div>
  )
}
```

```typescript
// components/SearchForm.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('query', query)
    params.set('page', '1') // 検索時はページをリセット
    
    router.push(`/posts?${params.toString()}`)
  }
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      handleSearch(formData.get('query') as string)
    }}>
      <input type="search" name="query" defaultValue={searchParams.get('query') || ''} />
      <button type="submit">Search</button>
    </form>
  )
}
```

### 5.3 Local State（useState）

コンポーネント内でのみ使用する状態は`useState`で管理します。

```typescript
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

### 5.4 Global State（Context API）

複数のコンポーネントで共有する状態はContext APIを使用します。

```typescript
// contexts/ThemeContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

```typescript
// app/layout.tsx
import { ThemeProvider } from '@/contexts/ThemeContext'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 5.5 複雑な状態管理（Zustand）

アプリケーション全体で使用する複雑な状態はZustandを使用します。

```typescript
// stores/useCartStore.ts
import { create } from 'zustand'

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  
  clearCart: () => set({ items: [] }),
  
  total: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
}))
```

```typescript
// components/Cart.tsx
'use client'

import { useCartStore } from '@/stores/useCartStore'

export function Cart() {
  const { items, removeItem, total } = useCartStore()
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${total()}</p>
    </div>
  )
}
```

---

## 6. キャッシュ戦略

### 6.1 Next.js 15のキャッシュ仕様

Next.js 15では、デフォルトのキャッシュ動作が変更されました:
- `fetch()`のデフォルトは`cache: 'no-store'`（動的レンダリング）
- 明示的にキャッシュを指定する必要があります

### 6.2 データキャッシュ

#### fetch APIでのキャッシュ制御

```typescript
// キャッシュあり（静的レンダリング）
async function fetchStaticData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache' // 無期限にキャッシュ
  })
  return res.json()
}

// 時間ベースの再検証
async function fetchRevalidatedData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // 1時間ごとに再検証
  })
  return res.json()
}

// キャッシュなし（動的レンダリング）
async function fetchDynamicData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store' // キャッシュしない
  })
  return res.json()
}
```

#### タグベースの再検証

```typescript
// データ取得時にタグを付与
async function fetchPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { 
      revalidate: 3600,
      tags: ['posts'] // タグを付与
    }
  })
  return res.json()
}

// Server Actionでタグベースの再検証
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost(data: FormData) {
  // ポスト作成処理
  await db.posts.create({ data })
  
  // 'posts'タグのキャッシュを無効化
  revalidateTag('posts')
}
```

### 6.3 ルートキャッシュ

#### ページ単位のキャッシュ制御

```typescript
// app/posts/page.tsx

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

// または
export const revalidate = 0 // キャッシュしない

// 静的レンダリング（60秒ごとに再検証）
export const revalidate = 60

async function PostsPage() {
  const posts = await fetchPosts()
  return <div>{/* ... */}</div>
}
```

### 6.4 パスベースの再検証

```typescript
'use server'

import { revalidatePath } from 'next/cache'

export async function updatePost(postId: string, data: FormData) {
  await db.posts.update({ where: { id: postId }, data })
  
  // 特定のパスのキャッシュを無効化
  revalidatePath('/posts')
  revalidatePath(`/posts/${postId}`)
  
  // レイアウトも含めて再検証
  revalidatePath('/posts', 'layout')
}
```

### 6.5 クライアントサイドキャッシュ（SWR）

```typescript
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function Posts() {
  const { data, error, mutate } = useSWR('/api/posts', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30000 // 30秒ごとに自動更新
  })
  
  const handleCreate = async () => {
    // 楽観的更新
    mutate(
      async () => {
        const newPost = await createPost()
        return [...data, newPost]
      },
      { optimisticData: [...data, { id: 'temp', title: 'New Post' }] }
    )
  }
  
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  
  return <div>{/* ... */}</div>
}
```

---

## 7. エラーハンドリング

### 7.1 error.tsxによるエラーバウンダリ

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーログを送信
    console.error('Error:', error)
  }, [error])
  
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### 7.2 global-error.tsx（ルートエラー）

```typescript
// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Global Error!</h2>
        <p>{error.message}</p>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  )
}
```

### 7.3 not-found.tsx（404エラー）

```typescript
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>Could not find the requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

```typescript
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation'

async function PostPage({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id)
  
  // ポストが見つからない場合はnot-found.tsxを表示
  if (!post) {
    notFound()
  }
  
  return <div>{post.title}</div>
}
```

### 7.4 APIエラーハンドリング

```typescript
// lib/api/client.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiClient<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const res = await fetch(url, options)
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new ApiError(
        res.status,
        errorData.message || 'An error occurred',
        errorData
      )
    }
    
    return await res.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, 'Network error occurred')
  }
}
```

### 7.5 Server Actionのエラーハンドリング

```typescript
'use server'

import { z } from 'zod'

const PostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
})

export async function createPost(formData: FormData) {
  // バリデーション
  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  })
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed',
    }
  }
  
  try {
    const post = await db.posts.create({
      data: validatedFields.data
    })
    
    revalidatePath('/posts')
    return { success: true, post }
  } catch (error) {
    return {
      message: 'Database error: Failed to create post',
    }
  }
}
```

---

## 8. パフォーマンス最適化

### 8.1 画像最適化

```typescript
import Image from 'next/image'

// 推奨: next/imageを使用
export function OptimizedImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority // LCPの場合はpriorityを設定
      placeholder="blur" // ぼかし効果
      blurDataURL="data:image/..." // ぼかし用データURL
    />
  )
}
```

### 8.2 フォント最適化

```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### 8.3 動的インポート（Code Splitting）

```typescript
import dynamic from 'next/dynamic'

// クライアントコンポーネントの動的インポート
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // SSRを無効化（クライアントのみ）
})

export function Page() {
  return (
    <div>
      <h1>Page</h1>
      <HeavyComponent />
    </div>
  )
}
```

### 8.4 メモ化

```typescript
'use client'

import { memo, useMemo, useCallback } from 'react'

// React.memoでコンポーネントをメモ化
const ExpensiveComponent = memo(function ExpensiveComponent({ data }: { data: any }) {
  // 重い計算処理
  const result = useMemo(() => {
    return data.map((item: any) => /* 重い処理 */)
  }, [data])
  
  // コールバックのメモ化
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])
  
  return <div onClick={handleClick}>{/* ... */}</div>
})
```

### 8.5 Streaming（ストリーミング）

```typescript
// app/posts/page.tsx
import { Suspense } from 'react'

export default function PostsPage() {
  return (
    <div>
      <h1>Posts</h1>
      
      {/* 即座にレンダリング */}
      <QuickSection />
      
      {/* ストリーミングでレンダリング */}
      <Suspense fallback={<PostsSkeleton />}>
        <SlowPosts />
      </Suspense>
      
      <Suspense fallback={<CommentsSkeleton />}>
        <SlowComments />
      </Suspense>
    </div>
  )
}
```

---

## 9. 型安全性とTypeScript

### 9.1 厳格な型定義

```typescript
// types/post.ts
export type Post = {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export type CreatePostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>

export type UpdatePostInput = Partial<CreatePostInput>
```

### 9.2 Server Actionsの型安全性

```typescript
// types/action.ts
export type ActionState<T> = {
  success?: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}
```

```typescript
'use server'

import { ActionState } from '@/types/action'
import { Post } from '@/types/post'

export async function createPost(
  prevState: ActionState<Post>,
  formData: FormData
): Promise<ActionState<Post>> {
  // 実装
  return { success: true, data: post }
}
```

### 9.3 ジェネリクスの活用

```typescript
// lib/api/client.ts
export async function get<T>(url: string): Promise<T> {
  const res = await fetch(url)
  return res.json()
}

export async function post<T, U>(url: string, data: U): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// 使用例
const posts = await get<Post[]>('/api/posts')
const newPost = await post<Post, CreatePostInput>('/api/posts', { title: '...', content: '...' })
```

### 9.4 Zodによるランタイムバリデーション

```typescript
import { z } from 'zod'

// スキーマ定義
export const PostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
})

// 型を推論
export type PostInput = z.infer<typeof PostSchema>

// バリデーション
export function validatePost(data: unknown): PostInput {
  return PostSchema.parse(data)
}
```

---

## 10. テスト

### 10.1 ユニットテスト（Jest + React Testing Library）

```typescript
// components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
})
```

### 10.2 Server Actionsのテスト

```typescript
// app/actions/posts.test.ts
import { createPost } from './posts'

// モック
jest.mock('@/lib/db', () => ({
  posts: {
    create: jest.fn(),
  },
}))

describe('createPost', () => {
  it('creates a post successfully', async () => {
    const formData = new FormData()
    formData.append('title', 'Test Post')
    formData.append('content', 'Test content')
    
    const result = await createPost(formData)
    
    expect(result.success).toBe(true)
    expect(result.data).toHaveProperty('id')
  })
  
  it('returns error for invalid data', async () => {
    const formData = new FormData()
    formData.append('title', '')
    formData.append('content', '')
    
    const result = await createPost(formData)
    
    expect(result.error).toBeDefined()
  })
})
```

### 10.3 E2Eテスト（Playwright）

```typescript
// tests/e2e/posts.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Posts', () => {
  test('should create a new post', async ({ page }) => {
    await page.goto('/posts/new')
    
    // フォーム入力
    await page.fill('input[name="title"]', 'Test Post')
    await page.fill('textarea[name="content"]', 'Test content')
    
    // 送信
    await page.click('button[type="submit"]')
    
    // リダイレクト確認
    await expect(page).toHaveURL(/\/posts\/\w+/)
    
    // コンテンツ確認
    await expect(page.locator('h1')).toHaveText('Test Post')
  })
})
```

---

## まとめ

この規約は、Next.js 15とReact 19を使用した開発における実践的なベストプラクティスをまとめたものです。以下のポイントを常に意識してください:

1. **Server ComponentとClient Componentの適切な使い分け**: デフォルトでServer Componentを使用し、必要な場合のみClient Componentを使用する
2. **データ取得の最適化**: 並列取得、Suspenseによるストリーミング、適切なキャッシュ戦略を活用する
3. **Server Actionsの活用**: フォーム送信やデータ更新にはServer Actionsを使用し、型安全性を保つ
4. **状態管理の階層化**: URL→Server State→Local State→Global Stateの順に検討する
5. **エラーハンドリングの徹底**: error.tsx、not-found.tsx、バリデーションを適切に実装する
6. **パフォーマンスの最適化**: 画像、フォント、Code Splittingを適切に使用する
7. **型安全性の確保**: TypeScriptとZodを活用してランタイムでも型安全性を保つ
8. **テストの実装**: ユニットテスト、統合テスト、E2Eテストを適切に実装する

これらの規約に従うことで、保守性が高く、パフォーマンスに優れたNext.jsアプリケーションを開発できます。

