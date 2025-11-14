# Next.js 15 / React 19 コンポーネント設計ガイド

第2章: コンポーネント設計の実践的なベストプラクティス

参考: [Next.js 15 / React 19 実践設計ガイド - 第2章](https://zenn.dev/k_mori/books/24320553af0956/viewer/6b1ab8)

## 📦 1. コンポーネントの分類

### 1.1 3つの主要な分類

#### Presentational Component（プレゼンテーションコンポーネント）
- **役割**: UIの表示に特化
- **特徴**:
  - 状態を持たない（ステートレス）
  - ロジックを持たない
  - Propsでデータを受け取る
  - 再利用性が高い

```tsx
// ✅ Presentational Component の例
type UserCardProps = {
  name: string
  email: string
  avatarUrl: string
}

const UserCard = ({ name, email, avatarUrl }: UserCardProps) => {
  return (
    <div className="card">
      <img src={avatarUrl} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  )
}
```

#### Container Component（コンテナコンポーネント）
- **役割**: ロジックとデータ取得を担当
- **特徴**:
  - データ取得を行う
  - 状態管理を行う
  - Presentational Componentをラップ
  - ビジネスロジックを持つ

```tsx
// ✅ Container Component の例
const UserCardContainer = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    fetchUser(userId).then(data => {
      setUser(data)
      setIsLoading(false)
    })
  }, [userId])
  
  if (isLoading) return <LoadingSpinner />
  if (!user) return <ErrorMessage />
  
  return <UserCard {...user} />
}
```

#### Layout Component（レイアウトコンポーネント）
- **役割**: ページ全体の構造を定義
- **特徴**:
  - ヘッダー、フッター、サイドバーなど
  - 複数のページで共有される
  - 子コンポーネントを配置する枠組み

```tsx
// ✅ Layout Component の例
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

## 🎯 2. Server Component と Client Component の境界設計

### 2.1 基本原則

**できる限りServer Componentを使う**

- Server Componentがデフォルト
- Client Componentは最小限に
- Client Componentの境界を明確に

### 2.2 Server Component（デフォルト）

**使うべき場合:**
- データベースからデータを取得
- バックエンドリソースに直接アクセス
- 機密情報を扱う（APIキーなど）
- 大きな依存関係をサーバーに保持
- 静的なコンテンツの表示

```tsx
// ✅ Server Component
const BlogPost = async ({ id }: { id: string }) => {
  // サーバー側で実行される
  const post = await db.post.findUnique({ where: { id } })
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

### 2.3 Client Component（'use client'）

**使うべき場合:**
- イベントリスナー（onClick, onChangeなど）
- State（useState, useReducer）
- Effect（useEffect）
- ブラウザAPI（window, documentなど）
- カスタムフック

```tsx
// ✅ Client Component
'use client'

import { useState } from 'react'

const CommentForm = () => {
  const [comment, setComment] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 送信処理
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit">投稿</button>
    </form>
  )
}
```

### 2.4 境界設計のベストプラクティス

#### パターン1: Server Component内にClient Componentを配置

```tsx
// ✅ 推奨
// app/page.tsx（Server Component）
const HomePage = async () => {
  const posts = await fetchPosts()
  
  return (
    <div>
      <h1>ブログ</h1>
      {/* Client Componentをネスト */}
      <SearchForm />
      <PostList posts={posts} />
    </div>
  )
}
```

#### パターン2: Childrenを使った構成

```tsx
// ✅ 推奨: Server ComponentをClient Componentの子として渡す
// app/layout.tsx（Server Component）
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClientSidebar>
      {/* childrenはServer Componentのまま */}
      {children}
    </ClientSidebar>
  )
}

// components/ClientSidebar.tsx（Client Component）
'use client'

const ClientSidebar = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true)
  
  return (
    <div className="layout">
      <aside className={isOpen ? 'open' : 'closed'}>
        <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      </aside>
      <main>{children}</main>
    </div>
  )
}
```

## 🧩 3. コンポーネントの粒度と分割

### 3.1 50行ルール

**目安**: 1つのコンポーネントは50行以内

- 50行を超えたら分割を検討
- 絶対的なルールではなく目安
- 責務の観点で判断

### 3.2 分割のタイミング

以下のいずれかに該当したら分割を検討:

1. **複数の責務を持っている**
2. **同じ処理を複数箇所で使っている**
3. **テストが書きづらい**
4. **ネストが深くなっている（3階層以上）**

### 3.3 分割の例

```tsx
// ❌ 悪い例: 1つのコンポーネントに詰め込みすぎ
const ProductPage = () => {
  return (
    <div>
      {/* ヘッダー */}
      <header>
        <img src="/logo.png" />
        <nav>
          <a href="/shop">Shop</a>
          <a href="/cart">Cart</a>
        </nav>
      </header>
      
      {/* 商品詳細 */}
      <main>
        <img src={product.image} />
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>¥{product.price}</p>
        <button>カートに追加</button>
      </main>
      
      {/* レビュー */}
      <section>
        <h2>レビュー</h2>
        {reviews.map(review => (
          <div key={review.id}>
            <p>{review.comment}</p>
            <span>{review.rating}★</span>
          </div>
        ))}
      </section>
    </div>
  )
}
```

```tsx
// ✅ 良い例: 適切に分割
const ProductPage = ({ productId }: { productId: string }) => {
  return (
    <div>
      <ProductHeader />
      <ProductDetails productId={productId} />
      <ProductReviews productId={productId} />
    </div>
  )
}

const ProductDetails = ({ productId }: { productId: string }) => {
  const product = useProduct(productId)
  
  return (
    <main>
      <ProductImage src={product.image} />
      <ProductInfo product={product} />
      <AddToCartButton productId={productId} />
    </main>
  )
}
```

## 📋 4. Props 設計

### 4.1 Props の基本ルール

#### 明確な型定義

```tsx
// ✅ 推奨: 型を明示
type ButtonProps = {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

const Button = ({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}
```

#### 必須とオプショナルの明確化

```tsx
type UserProfileProps = {
  // 必須
  id: string
  name: string
  email: string
  
  // オプショナル（?を付ける）
  avatarUrl?: string
  bio?: string
  
  // デフォルト値あり
  isVerified?: boolean
}
```

### 4.2 Props の命名規則

```tsx
type ComponentProps = {
  // データ: 名詞
  title: string
  user: User
  items: Item[]
  
  // 真偽値: is*, has*, can*, should* で始める
  isActive: boolean
  isLoading: boolean
  hasError: boolean
  canEdit: boolean
  shouldShow: boolean
  
  // イベントハンドラ: on* で始める
  onClick: () => void
  onChange: (value: string) => void
  onSubmit: (data: FormData) => void
  onDelete: (id: string) => void
  
  // その他
  className?: string     // スタイル拡張用
  children?: React.ReactNode  // 子要素
}
```

### 4.3 Props Drilling の回避

#### 問題: Props Drilling

```tsx
// ❌ Props Drilling の例
const App = () => {
  const [user, setUser] = useState<User>()
  return <Parent user={user} setUser={setUser} />
}

const Parent = ({ user, setUser }) => {
  return <Child user={user} setUser={setUser} />
}

const Child = ({ user, setUser }) => {
  return <GrandChild user={user} setUser={setUser} />
}

const GrandChild = ({ user, setUser }) => {
  // ここでようやく使う
  return <div>{user.name}</div>
}
```

#### 解決策: Context API

```tsx
// ✅ Context API を使用
'use client'

import { createContext, useContext, useState } from 'react'

const UserContext = createContext<{
  user: User | null
  setUser: (user: User) => void
} | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}

// 使用例
const GrandChild = () => {
  const { user } = useUser()  // 直接アクセス
  return <div>{user?.name}</div>
}
```

## 🎨 5. Composition Pattern（コンポジションパターン）

### 5.1 Children を使った柔軟な設計

```tsx
// ✅ 柔軟なコンポーネント構成
const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="card">
      {children}
    </div>
  )
}

const CardHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-header">{children}</div>
}

const CardBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-body">{children}</div>
}

const CardFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-footer">{children}</div>
}

// 使用例
const UserCard = () => {
  return (
    <Card>
      <CardHeader>
        <h2>ユーザー情報</h2>
      </CardHeader>
      <CardBody>
        <p>名前: John Doe</p>
        <p>Email: john@example.com</p>
      </CardBody>
      <CardFooter>
        <button>編集</button>
      </CardFooter>
    </Card>
  )
}
```

### 5.2 Slot Pattern（名前付きスロット）

```tsx
// ✅ 複数の slot を持つパターン
type PageLayoutProps = {
  header: React.ReactNode
  sidebar: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

const PageLayout = ({ header, sidebar, children, footer }: PageLayoutProps) => {
  return (
    <div className="layout">
      <header>{header}</header>
      <div className="content">
        <aside>{sidebar}</aside>
        <main>{children}</main>
      </div>
      {footer && <footer>{footer}</footer>}
    </div>
  )
}

// 使用例
const DashboardPage = () => {
  return (
    <PageLayout
      header={<DashboardHeader />}
      sidebar={<DashboardSidebar />}
      footer={<DashboardFooter />}
    >
      <DashboardContent />
    </PageLayout>
  )
}
```

### 5.3 Render Props Pattern

```tsx
// ✅ Render Props で柔軟性を提供
type DataFetcherProps<T> = {
  url: string
  children: (data: T | null, isLoading: boolean, error: Error | null) => React.ReactNode
}

const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [url])
  
  return <>{children(data, isLoading, error)}</>
}

// 使用例
const UserList = () => {
  return (
    <DataFetcher<User[]> url="/api/users">
      {(users, isLoading, error) => {
        if (isLoading) return <LoadingSpinner />
        if (error) return <ErrorMessage error={error} />
        return (
          <ul>
            {users?.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        )
      }}
    </DataFetcher>
  )
}
```

## 🔄 6. 状態管理

### 6.1 ローカル状態とグローバル状態

#### ローカル状態（useState）

```tsx
// ✅ コンポーネント内で完結する状態
'use client'

const Counter = () => {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

#### グローバル状態（Context / 状態管理ライブラリ）

```tsx
// ✅ 複数のコンポーネントで共有する状態
'use client'

// Context の例
import { create } from 'zustand'

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(item => item.id !== id) 
  })),
  clearCart: () => set({ items: [] }),
}))

// 使用例
const CartButton = () => {
  const items = useCartStore((state) => state.items)
  return <button>Cart ({items.length})</button>
}
```

### 6.2 状態の持ち上げ（Lifting State Up）

```tsx
// ✅ 共通の親コンポーネントに状態を持ち上げる
const ParentComponent = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  return (
    <div>
      <ItemList 
        selectedId={selectedId} 
        onSelect={setSelectedId} 
      />
      <ItemDetail 
        itemId={selectedId} 
      />
    </div>
  )
}
```

## 🚀 7. パフォーマンス最適化

### 7.1 React.memo

```tsx
// ✅ 不要な再レンダリングを防ぐ
import { memo } from 'react'

type UserCardProps = {
  user: User
  onClick: (id: string) => void
}

const UserCard = memo(({ user, onClick }: UserCardProps) => {
  console.log('Render UserCard:', user.id)
  
  return (
    <div onClick={() => onClick(user.id)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
})

UserCard.displayName = 'UserCard'
```

### 7.2 useCallback

```tsx
// ✅ コールバック関数のメモ化
'use client'

import { useCallback, useState } from 'react'

const UserList = ({ users }: { users: User[] }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  // ✅ 関数をメモ化して、子コンポーネントの再レンダリングを防ぐ
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
  }, [])
  
  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onClick={handleSelect}  // 常に同じ関数参照
        />
      ))}
    </div>
  )
}
```

### 7.3 useMemo

```tsx
// ✅ 重い計算結果のメモ化
'use client'

import { useMemo } from 'react'

const ProductList = ({ products }: { products: Product[] }) => {
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
  
  // ✅ ソート結果をメモ化
  const sortedProducts = useMemo(() => {
    console.log('Sorting products...')
    return [...products].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      return a.price - b.price
    })
  }, [products, sortBy])  // products か sortBy が変わった時のみ再計算
  
  return (
    <div>
      <select onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}>
        <option value="name">名前順</option>
        <option value="price">価格順</option>
      </select>
      {sortedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

## 🧪 8. テスト可能な設計

### 8.1 依存関係の注入

```tsx
// ✅ テストしやすい設計
type UserProfileProps = {
  user: User  // データを外部から受け取る
}

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}

// テストコード
test('UserProfile renders user data', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  }
  
  render(<UserProfile user={mockUser} />)
  
  expect(screen.getByText('John Doe')).toBeInTheDocument()
  expect(screen.getByText('john@example.com')).toBeInTheDocument()
})
```

### 8.2 純粋関数としてのコンポーネント

```tsx
// ✅ 同じ Props なら常に同じ結果
const Greeting = ({ name }: { name: string }) => {
  return <h1>Hello, {name}!</h1>
}

// ❌ 副作用を持つコンポーネント（テストしづらい）
const BadGreeting = ({ name }: { name: string }) => {
  // グローバルな状態を変更（副作用）
  window.lastGreetedUser = name
  
  return <h1>Hello, {name}!</h1>
}
```

## 📝 9. まとめ: コンポーネント設計のチェックリスト

### ✅ 設計前

- [ ] Server Component / Client Component の選択は適切か？
- [ ] コンポーネントの責務は単一か？
- [ ] 再利用可能な設計になっているか？
- [ ] Props の型定義は明確か？

### ✅ 実装中

- [ ] 50行以内に収まっているか？（目安）
- [ ] 適切にコンポーネントを分割しているか？
- [ ] Props Drilling が発生していないか？
- [ ] Compositionパターンを活用しているか？

### ✅ 実装後

- [ ] テストしやすい構造になっているか？
- [ ] パフォーマンスの問題はないか？
- [ ] 必要に応じてメモ化を行っているか？
- [ ] 命名規則に従っているか？

## 📚 参考リンク

- [Zenn - Next.js 15 / React 19 実践設計ガイド 第2章](https://zenn.dev/k_mori/books/24320553af0956/viewer/6b1ab8)
- [React - Thinking in React](https://react.dev/learn/thinking-in-react)
- [Next.js - Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js - Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

---

**更新日:** 2025-11-11  
**対象バージョン:** Next.js 15.x, React 19.x
