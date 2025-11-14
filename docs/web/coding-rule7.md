# Next.js 15 / React 19 エラーハンドリングガイド

第7章: エラーハンドリングの実践的なベストプラクティス

参考: [Next.js 15 / React 19 実践設計ガイド - 第7章](https://zenn.dev/k_mori/books/24320553af0956/viewer/8cbd0d)

## ⚠️ 1. エラーハンドリングの基本原則

### 1.1 エラーの分類

| エラーの種類 | 発生場所 | 処理方法 | ユーザーへの表示 |
|------------|---------|---------|----------------|
| **ユーザーエラー** | クライアント | バリデーション、フォームエラー | 具体的なメッセージ |
| **システムエラー** | サーバー/ネットワーク | エラーバウンダリー、ログ | 一般的なメッセージ |
| **予期しないエラー** | どこでも | グローバルエラーハンドラー | フォールバックUI |

### 1.2 エラーハンドリングの基本方針

1. **適切なエラーメッセージ**
   - ユーザーが理解できる言葉で
   - 次のアクションを明確に

2. **エラーの記録**
   - すべてのエラーをログに記録
   - デバッグに必要な情報を含める

3. **UIの崩壊を防ぐ**
   - エラーバウンダリーで保護
   - フォールバックUIを提供

4. **セキュリティ**
   - 内部情報を漏らさない
   - システムエラーは一般化

## 🛡️ 2. Next.js 15 のエラーハンドリング機能

### 2.1 error.tsx（エラーバウンダリー）

```tsx
// ✅ error.tsx の基本実装
// app/posts/error.tsx
'use client'  // error.tsx は必ず Client Component

import { useEffect } from 'react'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

const Error = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    // エラーログを送信
    console.error('Error:', error)
    
    // エラー監視サービスに送信（例: Sentry）
    // logErrorToService(error)
  }, [error])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
      <p className="text-gray-600 mb-4">
        {error.message || '予期しないエラーが発生しました'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        再試行
      </button>
    </div>
  )
}

export default Error
```

**特徴:**
- 自動的にエラーをキャッチ
- `reset()` で再試行可能
- 親のエラーバウンダリーに伝播しない

### 2.2 階層的なエラーハンドリング

```tsx
// ✅ 階層的なエラーバウンダリー
// app/layout.tsx（ルートエラーバウンダリー）
'use client'

const RootError = ({ error, reset }: ErrorProps) => {
  return (
    <html>
      <body>
        <div className="error-container">
          <h1>アプリケーションエラー</h1>
          <p>重大なエラーが発生しました</p>
          <button onClick={reset}>再読み込み</button>
        </div>
      </body>
    </html>
  )
}

// app/posts/error.tsx（投稿ページ専用）
const PostsError = ({ error, reset }: ErrorProps) => {
  return (
    <div>
      <h2>投稿の読み込みに失敗しました</h2>
      <button onClick={reset}>再試行</button>
    </div>
  )
}
```

### 2.3 not-found.tsx（404エラー）

```tsx
// ✅ not-found.tsx の実装
// app/posts/[id]/not-found.tsx
import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">記事が見つかりません</h2>
      <p className="text-gray-600 mb-4">
        お探しの記事は存在しないか、削除された可能性があります
      </p>
      <Link
        href="/posts"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        記事一覧に戻る
      </Link>
    </div>
  )
}

export default NotFound
```

```tsx
// ✅ notFound() 関数で明示的に呼び出し
import { notFound } from 'next/navigation'

const PostPage = async ({ id }: { id: string }) => {
  const post = await fetch(`https://api.example.com/posts/${id}`)
    .then(res => {
      if (res.status === 404) {
        notFound()  // not-found.tsx を表示
      }
      return res.json()
    })
  
  return <article>{post.content}</article>
}
```

## 🔄 3. Server Component でのエラーハンドリング

### 3.1 try-catch でのエラーハンドリング

```tsx
// ✅ Server Component でのエラーハンドリング
const PostPage = async ({ id }: { id: string }) => {
  try {
    const post = await fetch(`https://api.example.com/posts/${id}`)
    
    if (!post.ok) {
      throw new Error(`Failed to fetch post: ${post.status}`)
    }
    
    const data = await post.json()
    return <article>{data.content}</article>
  } catch (error) {
    // エラーをログに記録
    console.error('Error fetching post:', error)
    
    // エラーページにリダイレクト
    redirect('/error')
    
    // または notFound() を呼び出す
    // notFound()
  }
}
```

### 3.2 エラーメッセージの一般化

```tsx
// ✅ ユーザー向けのエラーメッセージ
const PostPage = async ({ id }: { id: string }) => {
  try {
    const post = await fetch(`https://api.example.com/posts/${id}`)
    
    if (!post.ok) {
      if (post.status === 404) {
        notFound()
      }
      throw new Error('記事の読み込みに失敗しました')
    }
    
    const data = await post.json()
    return <article>{data.content}</article>
  } catch (error) {
    // 内部エラーはログに記録
    console.error('Internal error:', error)
    
    // ユーザーには一般化されたメッセージ
    throw new Error('記事を読み込めませんでした。しばらくしてから再試行してください。')
  }
}
```

## 🎯 4. Client Component でのエラーハンドリング

### 4.1 useState でのエラー状態管理

```tsx
// ✅ useState でエラー状態を管理
'use client'

import { useState } from 'react'

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => {
        if (!res.ok) {
          throw new Error('投稿の取得に失敗しました')
        }
        return res.json()
      })
      .then(setPosts)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### 4.2 エラーコンポーネントの実装

```tsx
// ✅ 再利用可能なエラーコンポーネント
'use client'

type ErrorMessageProps = {
  error: Error | string
  onRetry?: () => void
}

const ErrorMessage = ({ error, onRetry }: ErrorMessageProps) => {
  const message = error instanceof Error ? error.message : error
  
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">エラーが発生しました</h3>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          再試行
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
```

## 🔧 5. Server Actions でのエラーハンドリング

### 5.1 基本的なエラーハンドリング

```tsx
// ✅ Server Action でのエラーハンドリング
'use server'

import { revalidatePath } from 'next/cache'

type ActionResult = {
  success: boolean
  error?: string
  message?: string
}

export async function createPost(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const title = formData.get('title') as string
    
    // バリデーション
    if (!title || title.length < 3) {
      return {
        success: false,
        error: 'タイトルは3文字以上必要です'
      }
    }
    
    // データ保存
    await db.post.create({
      data: { title }
    })
    
    revalidatePath('/posts')
    
    return {
      success: true,
      message: '投稿に成功しました'
    }
  } catch (error) {
    // エラーログ
    console.error('Error creating post:', error)
    
    // ユーザー向けメッセージ
    return {
      success: false,
      error: '投稿の保存に失敗しました。しばらくしてから再試行してください。'
    }
  }
}
```

### 5.2 Zod を使ったバリデーション

```tsx
// ✅ Zod でバリデーションとエラーハンドリング
'use server'

import { z } from 'zod'

const PostSchema = z.object({
  title: z.string().min(3, 'タイトルは3文字以上必要です'),
  content: z.string().min(10, '内容は10文字以上必要です'),
})

type FormState = {
  errors?: {
    title?: string[]
    content?: string[]
  }
  message?: string
}

export async function createPost(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // バリデーション
  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  })
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  
  try {
    await db.post.create({
      data: validatedFields.data
    })
    
    revalidatePath('/posts')
    return { message: '投稿に成功しました' }
  } catch (error) {
    console.error('Database error:', error)
    return {
      message: 'データベースエラーが発生しました'
    }
  }
}
```

## 📝 6. フォームエラーの表示

### 6.1 useFormState でのエラー表示

```tsx
// ✅ useFormState でフォームエラーを表示
'use client'

import { useFormState } from 'react-dom'
import { createPost } from './actions'

const CreatePostForm = () => {
  const [state, formAction] = useFormState(createPost, {})
  
  return (
    <form action={formAction}>
      <div>
        <label htmlFor="title">タイトル</label>
        <input
          id="title"
          name="title"
          type="text"
          aria-describedby="title-error"
          aria-invalid={!!state.errors?.title}
        />
        <div id="title-error" aria-live="polite" aria-atomic="true">
          {state.errors?.title?.map((error: string) => (
            <p key={error} className="text-red-500 text-sm">
              {error}
            </p>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="content">内容</label>
        <textarea
          id="content"
          name="content"
          aria-describedby="content-error"
          aria-invalid={!!state.errors?.content}
        />
        <div id="content-error" aria-live="polite" aria-atomic="true">
          {state.errors?.content?.map((error: string) => (
            <p key={error} className="text-red-500 text-sm">
              {error}
            </p>
          ))}
        </div>
      </div>
      
      {state.message && (
        <div
          className={state.errors ? 'text-red-500' : 'text-green-500'}
          aria-live="polite"
        >
          {state.message}
        </div>
      )}
      
      <button type="submit">投稿</button>
    </form>
  )
}
```

### 6.2 リアルタイムバリデーション

```tsx
// ✅ リアルタイムバリデーション
'use client'

import { useState } from 'react'

const PostForm = () => {
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState<string | null>(null)
  
  const validateTitle = (value: string) => {
    if (value.length < 3) {
      setTitleError('タイトルは3文字以上必要です')
    } else {
      setTitleError(null)
    }
  }
  
  return (
    <form>
      <div>
        <label htmlFor="title">タイトル</label>
        <input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            validateTitle(e.target.value)
          }}
          onBlur={(e) => validateTitle(e.target.value)}
          aria-invalid={!!titleError}
          aria-describedby="title-error"
        />
        {titleError && (
          <p id="title-error" className="text-red-500 text-sm">
            {titleError}
          </p>
        )}
      </div>
    </form>
  )
}
```

## 🔍 7. エラーログとモニタリング

### 7.1 エラーログの記録

```tsx
// ✅ エラーログの記録
'use client'

import { useEffect } from 'react'

const ErrorLogger = ({ error }: { error: Error }) => {
  useEffect(() => {
    // エラー情報をログに記録
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }
    
    // コンソールに記録
    console.error('Error occurred:', errorInfo)
    
    // エラー監視サービスに送信（例: Sentry）
    // Sentry.captureException(error, { extra: errorInfo })
    
    // カスタムエンドポイントに送信
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorInfo),
    }).catch(console.error)
  }, [error])
  
  return null
}
```

### 7.2 Sentry の統合

```tsx
// ✅ Sentry の統合
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})

// app/error.tsx
'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

const Error = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])
  
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={reset}>再試行</button>
    </div>
  )
}
```

## 🎨 8. ユーザー体験の向上

### 8.1 エラー時のガイド表示

```tsx
// ✅ エラー時のガイド表示
const ErrorWithGuide = ({ error, reset }: ErrorProps) => {
  return (
    <div className="error-container">
      <h2>エラーが発生しました</h2>
      <p>{error.message}</p>
      
      <div className="error-guide">
        <h3>次のステップ:</h3>
        <ul>
          <li>ページを再読み込みしてください</li>
          <li>しばらく時間をおいてから再試行してください</li>
          <li>問題が続く場合は、サポートにお問い合わせください</li>
        </ul>
      </div>
      
      <div className="error-actions">
        <button onClick={reset}>再試行</button>
        <button onClick={() => window.location.href = '/'}>
          ホームに戻る
        </button>
      </div>
    </div>
  )
}
```

### 8.2 トースト通知でのエラー表示

```tsx
// ✅ トースト通知でのエラー表示
'use client'

import { toast } from 'sonner'

const PostForm = () => {
  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('投稿に失敗しました')
      }
      
      toast.success('投稿に成功しました')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'エラーが発生しました'
      )
    }
  }
  
  return <form action={handleSubmit}>...</form>
}
```

### 8.3 リトライ機能

```tsx
// ✅ リトライ機能の実装
'use client'

import { useState } from 'react'

const RetryableFetch = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  
  const fetchData = async (retries = 0) => {
    try {
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
      setError(null)
      setRetryCount(0)
    } catch (err) {
      if (retries < 3) {
        // 指数バックオフ
        const delay = Math.pow(2, retries) * 1000
        setTimeout(() => {
          setRetryCount(retries + 1)
          fetchData(retries + 1)
        }, delay)
      } else {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      }
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [])
  
  if (error) {
    return (
      <div>
        <p>エラー: {error.message}</p>
        {retryCount > 0 && (
          <p>再試行回数: {retryCount}/3</p>
        )}
        <button onClick={() => fetchData(0)}>再試行</button>
      </div>
    )
  }
  
  return <div>{/* データ表示 */}</div>
}
```

## 🔐 9. セキュリティ考慮事項

### 9.1 エラーメッセージの一般化

```tsx
// ❌ 悪い例: 内部情報を漏らす
const BadError = ({ error }: { error: Error }) => {
  return (
    <div>
      <p>エラー: {error.message}</p>
      <pre>{error.stack}</pre>  {/* ❌ スタックトレースを表示 */}
    </div>
  )
}

// ✅ 良い例: 一般化されたメッセージ
const GoodError = ({ error }: { error: Error }) => {
  // 本番環境では詳細を隠す
  const isProduction = process.env.NODE_ENV === 'production'
  
  return (
    <div>
      <p>
        {isProduction
          ? 'エラーが発生しました。しばらくしてから再試行してください。'
          : error.message  // 開発環境のみ詳細を表示
        }
      </p>
    </div>
  )
}
```

### 9.2 エラーログのサニタイズ

```tsx
// ✅ エラーログのサニタイズ
const sanitizeError = (error: Error) => {
  return {
    message: error.message,
    // スタックトレースは本番環境では除外
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    // 機密情報を除外
    // パスワード、トークンなどは含めない
  }
}
```

## 📝 10. まとめ: エラーハンドリングのチェックリスト

### ✅ 設計時

- [ ] エラーの種類を分類したか？
- [ ] エラーバウンダリーを適切に配置したか？
- [ ] エラーメッセージの内容を決めたか？
- [ ] エラーログの記録方法を決めたか？

### ✅ 実装時

- [ ] try-catch でエラーを適切にキャッチしたか？
- [ ] error.tsx を実装したか？
- [ ] not-found.tsx を実装したか？
- [ ] フォームエラーを適切に表示したか？

### ✅ UX 改善

- [ ] ユーザー向けのエラーメッセージを提供したか？
- [ ] リトライ機能を実装したか？
- [ ] エラー時のガイドを表示したか？
- [ ] アクセシビリティを考慮したか？

### ✅ セキュリティ

- [ ] 内部情報を漏らしていないか？
- [ ] エラーログをサニタイズしたか？
- [ ] 本番環境でのエラー表示を確認したか？

## 📚 参考リンク

- [Zenn - Next.js 15 / React 19 実践設計ガイド 第7章](https://zenn.dev/k_mori/books/24320553af0956/viewer/8cbd0d)
- [Next.js - Error Handling](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [Next.js - Not Found](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- [React - Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

**更新日:** 2025-11-11  
**対象バージョン:** Next.js 15.x, React 19.x



