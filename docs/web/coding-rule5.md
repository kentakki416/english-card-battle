# Next.js 15 / React 19 状態管理ガイド

第5章: 状態管理の実践的なベストプラクティス

参考: [Next.js 15 / React 19 実践設計ガイド - 第5章](https://zenn.dev/k_mori/books/24320553af0956/viewer/714dcb)

## 📊 1. 状態管理の基本原則

### 1.1 状態の分類

Next.js 15 / React 19 では、状態を以下のように分類します：

| 状態の種類 | 管理方法 | 使用ケース |
|-----------|---------|-----------|
| **Server State** | Server Component / API | データベース、API からのデータ |
| **Client State** | useState / Context / ライブラリ | UI状態、フォーム入力、モーダル開閉 |
| **URL State** | useSearchParams / usePathname | 検索クエリ、フィルタ、ページネーション |

### 1.2 状態管理の基本原則

1. **最小限の状態管理**
   - 必要な状態のみを管理
   - 計算可能な値は状態にしない

2. **単一の情報源（Single Source of Truth）**
   - 同じデータを複数箇所で管理しない
   - 一箇所で管理し、必要に応じて配布

3. **不変性（Immutability）**
   - 状態を直接変更しない
   - 新しいオブジェクト/配列を作成

4. **予測可能性**
   - 状態の変更は純粋な関数で
   - 副作用を最小限に

## 🎯 2. 状態管理の選択指針

### 2.1 選択フローチャート

```
状態管理を検討
    ↓
┌─────────────────────────┐
│ サーバーから取得するデータ？│
└─────────────────────────┘
    ↓ YES              ↓ NO
Server State        ┌─────────────────────────┐
(Server Component)  │ 1つのコンポーネント内？  │
                    └─────────────────────────┘
                        ↓ YES          ↓ NO
                    useState        ┌─────────────────────────┐
                                    │ 2-3個のコンポーネント？  │
                                    └─────────────────────────┘
                                        ↓ YES          ↓ NO
                                    Context API    ┌─────────────────────────┐
                                                    │ 頻繁に更新される？      │
                                                    └─────────────────────────┘
                                                        ↓ YES      ↓ NO
                                                    Zustand    Context API
                                                    Jotai      (軽量)
```

### 2.2 各方法の比較

| 方法 | 複雑度 | パフォーマンス | 使用ケース |
|------|--------|---------------|-----------|
| `useState` | ⭐ | ⭐⭐⭐ | 単一コンポーネント内 |
| `useContext` | ⭐⭐ | ⭐⭐ | 少数コンポーネント間 |
| `Zustand` | ⭐⭐ | ⭐⭐⭐ | 中規模アプリ |
| `Jotai` | ⭐⭐ | ⭐⭐⭐ | アトミックな状態管理 |
| `Redux` | ⭐⭐⭐ | ⭐⭐ | 大規模アプリ |

## 🔵 3. useState（ローカル状態）

### 3.1 基本的な使い方

```tsx
// ✅ 基本パターン
'use client'

import { useState } from 'react'

const Counter = () => {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  )
}
```

### 3.2 オブジェクトの状態管理

```tsx
// ✅ オブジェクトの状態管理
'use client'

import { useState } from 'react'

type User = {
  name: string
  email: string
  age: number
}

const UserForm = () => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    age: 0,
  })
  
  // ✅ 不変性を保つ更新
  const updateName = (name: string) => {
    setUser(prev => ({ ...prev, name }))
  }
  
  const updateEmail = (email: string) => {
    setUser(prev => ({ ...prev, email }))
  }
  
  return (
    <form>
      <input
        value={user.name}
        onChange={(e) => updateName(e.target.value)}
        placeholder="名前"
      />
      <input
        value={user.email}
        onChange={(e) => updateEmail(e.target.value)}
        placeholder="メール"
      />
    </form>
  )
}
```

### 3.3 配列の状態管理

```tsx
// ✅ 配列の状態管理
'use client'

import { useState } from 'react'

const TodoList = () => {
  const [todos, setTodos] = useState<string[]>([])
  const [input, setInput] = useState('')
  
  const addTodo = () => {
    if (input.trim()) {
      setTodos(prev => [...prev, input])  // ✅ 新しい配列を作成
      setInput('')
    }
  }
  
  const removeTodo = (index: number) => {
    setTodos(prev => prev.filter((_, i) => i !== index))  // ✅ フィルタで新しい配列
  }
  
  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
      />
      <button onClick={addTodo}>追加</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => removeTodo(index)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## 🔄 4. useReducer（複雑な状態管理）

### 4.1 基本的な使い方

```tsx
// ✅ useReducer で複雑な状態を管理
'use client'

import { useReducer } from 'react'

type State = {
  count: number
  step: number
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'setStep'; step: number }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step }
    case 'decrement':
      return { ...state, count: state.count - state.step }
    case 'reset':
      return { ...state, count: 0 }
    case 'setStep':
      return { ...state, step: action.step }
    default:
      return state
  }
}

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 })
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Step: {state.step}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <input
        type="number"
        value={state.step}
        onChange={(e) => dispatch({ type: 'setStep', step: Number(e.target.value) })}
      />
    </div>
  )
}
```

## 🌐 5. Context API（グローバル状態）

### 5.1 基本的な実装

```tsx
// ✅ Context API の実装
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
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

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// 使用例
const App = () => {
  return (
    <ThemeProvider>
      <Header />
      <Main />
    </ThemeProvider>
  )
}

const Header = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>テーマ切り替え</button>
    </header>
  )
}
```

### 5.2 複数のContextに分割

```tsx
// ✅ 複数のContextに分割（パフォーマンス向上）
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

// Theme Context
type ThemeContextType = {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

// User Context
type UserContextType = {
  user: User | null
  setUser: (user: User) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
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
```

## 🐻 6. Zustand（軽量な状態管理）

### 6.1 基本的な使い方

```tsx
// ✅ Zustand の基本実装
'use client'

import { create } from 'zustand'

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  
  addItem: (item) => set((state) => {
    const newItems = [...state.items, item]
    return {
      items: newItems,
      total: newItems.reduce((sum, item) => sum + item.price, 0)
    }
  }),
  
  removeItem: (id) => set((state) => {
    const newItems = state.items.filter(item => item.id !== id)
    return {
      items: newItems,
      total: newItems.reduce((sum, item) => sum + item.price, 0)
    }
  }),
  
  clearCart: () => set({ items: [], total: 0 }),
}))

// 使用例
const CartButton = () => {
  const { items, total } = useCartStore()
  
  return (
    <button>
      Cart ({items.length}) - ¥{total}
    </button>
  )
}

const AddToCartButton = ({ product }: { product: Product }) => {
  const addItem = useCartStore((state) => state.addItem)
  
  return (
    <button onClick={() => addItem({ id: product.id, price: product.price })}>
      カートに追加
    </button>
  )
}
```

### 6.2 ミドルウェアの使用

```tsx
// ✅ Zustand のミドルウェア（persist, devtools）
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'

type SettingsStore = {
  theme: 'light' | 'dark'
  language: 'ja' | 'en'
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (language: 'ja' | 'en') => void
}

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        language: 'ja',
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
      }),
      {
        name: 'settings-storage',  // localStorage のキー
        storage: createJSONStorage(() => localStorage),
      }
    ),
    { name: 'SettingsStore' }  // DevTools の名前
  )
)
```

## ⚛️ 7. Jotai（アトミックな状態管理）

### 7.1 基本的な使い方

```tsx
// ✅ Jotai の基本実装
'use client'

import { atom, useAtom } from 'jotai'

// アトミックな状態定義
const countAtom = atom(0)
const doubleCountAtom = atom((get) => get(countAtom) * 2)

const Counter = () => {
  const [count, setCount] = useAtom(countAtom)
  const [doubleCount] = useAtom(doubleCountAtom)
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Double: {doubleCount}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

### 7.2 非同期アトム

```tsx
// ✅ Jotai の非同期アトム
import { atom } from 'jotai'

const userIdAtom = atom(1)

const userAtom = atom(async (get) => {
  const id = get(userIdAtom)
  const response = await fetch(`/api/users/${id}`)
  return response.json()
})

const UserProfile = () => {
  const [user] = useAtom(userAtom)
  
  // Suspense が必要
  return <div>{user.name}</div>
}
```

## 🔗 8. Server State と Client State の使い分け

### 8.1 Server State（サーバーから取得）

```tsx
// ✅ Server Component でデータ取得
// app/posts/page.tsx
const PostsPage = async () => {
  const posts = await fetch('https://api.example.com/posts')
    .then(res => res.json())
  
  return <PostList posts={posts} />
}
```

```tsx
// ✅ SWR で Server State を管理
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const PostList = () => {
  const { data: posts, error, isLoading } = useSWR(
    '/api/posts',
    fetcher
  )
  
  if (isLoading) return <Loading />
  if (error) return <Error />
  
  return (
    <ul>
      {posts.map((post: Post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### 8.2 Client State（UI状態）

```tsx
// ✅ Client State は useState や状態管理ライブラリで
'use client'

import { useState } from 'react'

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>開く</button>
      {isOpen && (
        <div className="modal">
          <button onClick={() => setIsOpen(false)}>閉じる</button>
        </div>
      )}
    </>
  )
}
```

### 8.3 URL State（URLパラメータ）

```tsx
// ✅ URL State は useSearchParams で管理
'use client'

import { useSearchParams, useRouter } from 'next/navigation'

const SearchFilter = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const category = searchParams.get('category') || 'all'
  const query = searchParams.get('q') || ''
  
  const updateCategory = (newCategory: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('category', newCategory)
    router.push(`?${params.toString()}`)
  }
  
  return (
    <div>
      <select value={category} onChange={(e) => updateCategory(e.target.value)}>
        <option value="all">すべて</option>
        <option value="tech">技術</option>
        <option value="design">デザイン</option>
      </select>
    </div>
  )
}
```

## 🎨 9. 状態管理のベストプラクティス

### 9.1 状態の正規化

```tsx
// ❌ 悪い例: ネストされた状態
type BadState = {
  posts: {
    id: string
    author: {
      id: string
      name: string
      posts: Post[]
    }
  }[]
}

// ✅ 良い例: 正規化された状態
type GoodState = {
  posts: {
    [id: string]: {
      id: string
      authorId: string
      title: string
    }
  }
  authors: {
    [id: string]: {
      id: string
      name: string
    }
  }
  postIds: string[]
}
```

### 9.2 計算値は状態にしない

```tsx
// ❌ 悪い例: 計算可能な値を状態に
const BadExample = () => {
  const [items, setItems] = useState<Item[]>([])
  const [total, setTotal] = useState(0)  // ❌ 計算可能
  
  const addItem = (item: Item) => {
    setItems([...items, item])
    setTotal(total + item.price)  // ❌ 同期がずれる可能性
  }
}

// ✅ 良い例: useMemo で計算
const GoodExample = () => {
  const [items, setItems] = useState<Item[]>([])
  
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  )
  
  const addItem = (item: Item) => {
    setItems([...items, item])
  }
}
```

### 9.3 状態の持ち上げ（Lifting State Up）

```tsx
// ✅ 共通の親に状態を持ち上げる
const ParentComponent = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  return (
    <div>
      <ItemList 
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ItemDetail itemId={selectedId} />
    </div>
  )
}
```

## 🚀 10. パフォーマンス最適化

### 10.1 Context の最適化

```tsx
// ✅ Context を分割して再レンダリングを最小化
// 値と関数を分離
const ThemeValueContext = createContext<'light' | 'dark'>('light')
const ThemeUpdateContext = createContext<() => void>(() => {})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  return (
    <ThemeValueContext.Provider value={theme}>
      <ThemeUpdateContext.Provider value={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}>
        {children}
      </ThemeUpdateContext.Provider>
    </ThemeValueContext.Provider>
  )
}

// 値だけが必要なコンポーネント
const ThemeDisplay = () => {
  const theme = useContext(ThemeValueContext)  // 更新時に再レンダリングされない
  return <div>Theme: {theme}</div>
}

// 更新だけが必要なコンポーネント
const ThemeToggle = () => {
  const toggle = useContext(ThemeUpdateContext)  // 値変更時に再レンダリングされない
  return <button onClick={toggle}>Toggle</button>
}
```

### 10.2 Zustand のセレクター

```tsx
// ✅ セレクターで必要な部分だけ購読
const CartButton = () => {
  // ✅ 必要な値だけ購読（items が変わった時だけ再レンダリング）
  const itemCount = useCartStore((state) => state.items.length)
  
  return <button>Cart ({itemCount})</button>
}

const CartTotal = () => {
  // ✅ total だけ購読
  const total = useCartStore((state) => state.total)
  
  return <div>Total: ¥{total}</div>
}
```

## 📝 11. まとめ: 状態管理のチェックリスト

### ✅ 設計時

- [ ] Server State / Client State / URL State を適切に分類したか？
- [ ] 最小限の状態管理になっているか？
- [ ] 状態の正規化を検討したか？
- [ ] 適切な状態管理方法を選んだか？

### ✅ 実装時

- [ ] 不変性を保っているか？
- [ ] 計算可能な値を状態にしていないか？
- [ ] 状態の持ち上げが適切か？
- [ ] エラーハンドリングを実装したか？

### ✅ 最適化

- [ ] 不要な再レンダリングを防いでいるか？
- [ ] Context を適切に分割しているか？
- [ ] セレクターを活用しているか？
- [ ] パフォーマンスを計測したか？

## 📚 参考リンク

- [Zenn - Next.js 15 / React 19 実践設計ガイド 第5章](https://zenn.dev/k_mori/books/24320553af0956/viewer/714dcb)
- [React - State Management](https://react.dev/learn/managing-state)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Jotai Documentation](https://jotai.org/)
- [SWR Documentation](https://swr.vercel.app/)

---

**更新日:** 2025-11-11  
**対象バージョン:** Next.js 15.x, React 19.x



