# Next.js 15 / React 19 データ更新ガイド

第4章: データ更新（Mutation）の実践的なベストプラクティス

参考: [Next.js 15 / React 19 実践設計ガイド - 第4章](https://zenn.dev/k_mori/books/24320553af0956/viewer/9bce66)

## 🔄 1. データ更新の基本原則

### 1.1 Server Actions を優先

**Next.js 15 の新機能:**
- Server Actions によるフォーム処理
- JavaScriptなしでも動作（Progressive Enhancement）
- 型安全なサーバー側処理

```tsx
// ✅ 推奨: Server Actions を使用
// app/posts/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  // データベースに保存
  await db.post.create({
    data: { title, content }
  })
  
  // キャッシュを再検証
  revalidatePath('/posts')
}
```

```tsx
// app/posts/new/page.tsx
import { createPost } from '../actions'

const NewPostPage = () => {
  return (
    <form action={createPost}>
      <input name="title" type="text" required />
      <textarea name="content" required />
      <button type="submit">投稿</button>
    </form>
  )
}

export default NewPostPage
```

### 1.2 データ更新の分類

| 更新方法 | 使用場所 | 特徴 |
|---------|---------|------|
| Server Actions | サーバー側 | 型安全、SEO対応、Progressive Enhancement |
| Client Component | クライアント側 | インタラクティブ、リアルタイム更新 |
| API Routes | API エンドポイント | 外部からのアクセス、REST API |

## 🎯 2. Server Actions の実装パターン

### 2.1 基本的な Server Action

```tsx
// ✅ 基本パターン
'use server'

export async function submitForm(formData: FormData) {
  // 1. バリデーション
  const title = formData.get('title') as string
  if (!title || title.length < 3) {
    return { error: 'タイトルは3文字以上必要です' }
  }
  
  // 2. データ処理
  try {
    await db.post.create({
      data: {
        title,
        content: formData.get('content') as string
      }
    })
    
    // 3. キャッシュ再検証
    revalidatePath('/posts')
    
    // 4. 成功レスポンス
    return { success: true }
  } catch (error) {
    // 5. エラーハンドリング
    return { error: 'データの保存に失敗しました' }
  }
}
```

### 2.2 TypeScript での型安全な実装

```tsx
// ✅ 推奨: Zod でバリデーション
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

// スキーマ定義
const PostSchema = z.object({
  title: z.string().min(3, 'タイトルは3文字以上必要です'),
  content: z.string().min(10, '内容は10文字以上必要です'),
})

type PostFormState = {
  errors?: {
    title?: string[]
    content?: string[]
  }
  message?: string
}

export async function createPost(
  prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
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
  
  // データ保存
  try {
    await db.post.create({
      data: validatedFields.data
    })
    
    revalidatePath('/posts')
    return { message: '投稿に成功しました' }
  } catch (error) {
    return { message: 'データベースエラーが発生しました' }
  }
}
```

### 2.3 useFormState でのフォーム状態管理

```tsx
// ✅ useFormState を使用
'use client'

import { useFormState } from 'react-dom'
import { createPost } from './actions'

const CreatePostForm = () => {
  const [state, formAction] = useFormState(createPost, { message: '' })
  
  return (
    <form action={formAction}>
      <div>
        <label htmlFor="title">タイトル</label>
        <input
          id="title"
          name="title"
          type="text"
          required
        />
        {state.errors?.title && (
          <p className="text-red-500">{state.errors.title[0]}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="content">内容</label>
        <textarea
          id="content"
          name="content"
          required
        />
        {state.errors?.content && (
          <p className="text-red-500">{state.errors.content[0]}</p>
        )}
      </div>
      
      {state.message && (
        <p className={state.errors ? 'text-red-500' : 'text-green-500'}>
          {state.message}
        </p>
      )}
      
      <button type="submit">投稿</button>
    </form>
  )
}

export default CreatePostForm
```

### 2.4 useFormStatus での送信状態管理

```tsx
// ✅ useFormStatus で送信中の状態を表示
'use client'

import { useFormStatus } from 'react-dom'

const SubmitButton = () => {
  const { pending } = useFormStatus()
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? '送信中...' : '投稿'}
    </button>
  )
}

// 使用例
const CreatePostForm = () => {
  return (
    <form action={createPost}>
      {/* フォームフィールド */}
      <SubmitButton />
    </form>
  )
}
```

## 🔁 3. キャッシュの再検証

### 3.1 revalidatePath

```tsx
// ✅ 特定のパスのキャッシュを再検証
'use server'

import { revalidatePath } from 'next/cache'

export async function updatePost(id: string, formData: FormData) {
  await db.post.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
    }
  })
  
  // ✅ 特定のパスを再検証
  revalidatePath('/posts')  // 記事一覧ページ
  revalidatePath(`/posts/${id}`)  // 記事詳細ページ
}
```

**使用ケース:**
- フォーム送信後
- データ更新後
- 特定のページのキャッシュをクリアしたい時

### 3.2 revalidateTag

```tsx
// ✅ タグベースのキャッシュ再検証
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  await db.post.create({
    data: {
      title: formData.get('title') as string,
    }
  })
  
  // ✅ タグで再検証
  revalidateTag('posts')  // 'posts' タグを持つ全てのキャッシュを再検証
}

// データ取得時にタグを設定
const posts = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] }
})
```

**使用ケース:**
- 複数の関連ページを一度に再検証したい時
- 細かいキャッシュ制御が必要な時

### 3.3 再検証戦略の比較

```tsx
// パターン1: revalidatePath（シンプル）
revalidatePath('/posts')  // /posts のみ再検証

// パターン2: revalidatePath with layout（広範囲）
revalidatePath('/posts', 'layout')  // /posts 配下の全ページを再検証

// パターン3: revalidateTag（柔軟）
revalidateTag('posts')  // 'posts' タグを持つ全てを再検証
```

## 📝 4. CRUD 操作の実装パターン

### 4.1 作成（Create）

```tsx
// ✅ Create: Server Action
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
    }
  })
  
  revalidatePath('/posts')
  redirect(`/posts/${post.id}`)  // 作成後に詳細ページへリダイレクト
}
```

### 4.2 更新（Update）

```tsx
// ✅ Update: Server Action
'use server'

export async function updatePost(id: string, formData: FormData) {
  await db.post.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
    }
  })
  
  revalidatePath(`/posts/${id}`)
  revalidatePath('/posts')
  
  return { success: true, message: '更新しました' }
}
```

### 4.3 削除（Delete）

```tsx
// ✅ Delete: Server Action
'use server'

import { redirect } from 'next/navigation'

export async function deletePost(id: string) {
  await db.post.delete({
    where: { id }
  })
  
  revalidatePath('/posts')
  redirect('/posts')  // 削除後に一覧ページへリダイレクト
}
```

```tsx
// 使用例: 削除ボタン
'use client'

import { deletePost } from './actions'

const DeleteButton = ({ postId }: { postId: string }) => {
  const handleDelete = async () => {
    if (confirm('本当に削除しますか？')) {
      await deletePost(postId)
    }
  }
  
  return (
    <button onClick={handleDelete} className="text-red-500">
      削除
    </button>
  )
}
```

## 🎨 5. Client Component でのデータ更新

### 5.1 fetch API での更新

```tsx
// ✅ Client Component での POST リクエスト
'use client'

import { useState } from 'react'

const CreatePostForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.get('title'),
          content: formData.get('content'),
        }),
      })
      
      if (!response.ok) {
        throw new Error('投稿に失敗しました')
      }
      
      // 成功後の処理
      window.location.href = '/posts'
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラー')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="title" type="text" required />
      <textarea name="content" required />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? '送信中...' : '投稿'}
      </button>
    </form>
  )
}
```

### 5.2 SWR での更新（Mutation）

```tsx
// ✅ SWR の mutate を使用
'use client'

import useSWR, { useSWRConfig } from 'swr'

const PostList = () => {
  const { data: posts } = useSWR('/api/posts', fetcher)
  const { mutate } = useSWRConfig()
  
  const handleDelete = async (id: string) => {
    // 楽観的更新
    mutate(
      '/api/posts',
      posts?.filter((post: Post) => post.id !== id),
      false
    )
    
    // API 呼び出し
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    
    // 再検証
    mutate('/api/posts')
  }
  
  return (
    <ul>
      {posts?.map((post: Post) => (
        <li key={post.id}>
          {post.title}
          <button onClick={() => handleDelete(post.id)}>削除</button>
        </li>
      ))}
    </ul>
  )
}
```

### 5.3 React Query での更新

```tsx
// ✅ React Query の useMutation
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

const CreatePostForm = () => {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed')
      return response.json()
    },
    onSuccess: () => {
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    mutation.mutate({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="title" type="text" required />
      <textarea name="content" required />
      {mutation.error && (
        <p className="text-red-500">{mutation.error.message}</p>
      )}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? '送信中...' : '投稿'}
      </button>
    </form>
  )
}
```

## 🚀 6. 楽観的更新（Optimistic Update）

### 6.1 楽観的更新の基本

```tsx
// ✅ 楽観的更新の実装
'use client'

import { useState, useTransition } from 'react'

const LikeButton = ({ postId, initialLikes }: { postId: string, initialLikes: number }) => {
  const [likes, setLikes] = useState(initialLikes)
  const [isPending, startTransition] = useTransition()
  
  const handleLike = () => {
    // 1. 楽観的にUIを更新
    setLikes(likes + 1)
    
    // 2. サーバーに送信
    startTransition(async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/like`, {
          method: 'POST',
        })
        
        if (!response.ok) {
          // 3. エラー時にロールバック
          setLikes(likes)
        }
      } catch (error) {
        // 3. エラー時にロールバック
        setLikes(likes)
      }
    })
  }
  
  return (
    <button onClick={handleLike} disabled={isPending}>
      ❤️ {likes}
    </button>
  )
}
```

### 6.2 Server Actions での楽観的更新

```tsx
// ✅ Server Actions + useOptimistic
'use client'

import { useOptimistic } from 'react'
import { likePost } from './actions'

type Post = {
  id: string
  likes: number
}

const PostCard = ({ post }: { post: Post }) => {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    post.likes,
    (state, amount: number) => state + amount
  )
  
  const handleLike = async () => {
    addOptimisticLike(1)  // 楽観的に+1
    await likePost(post.id)  // サーバーに送信
  }
  
  return (
    <div>
      <h3>{post.title}</h3>
      <button onClick={handleLike}>
        ❤️ {optimisticLikes}
      </button>
    </div>
  )
}
```

## 🔐 7. セキュリティとバリデーション

### 7.1 サーバー側でのバリデーション

```tsx
// ✅ 必ずサーバー側でバリデーション
'use server'

import { z } from 'zod'

const PostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(10).max(5000),
  published: z.boolean().optional(),
})

export async function createPost(formData: FormData) {
  // 1. 入力値の取得
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    published: formData.get('published') === 'on',
  }
  
  // 2. バリデーション
  const result = PostSchema.safeParse(rawData)
  
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  
  // 3. データ処理
  await db.post.create({
    data: result.data
  })
  
  return { success: true }
}
```

### 7.2 認証と認可

```tsx
// ✅ 認証チェック
'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function updatePost(id: string, formData: FormData) {
  // 1. 認証チェック
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }
  
  // 2. 認可チェック
  const post = await db.post.findUnique({
    where: { id },
    select: { authorId: true }
  })
  
  if (post.authorId !== session.user.id) {
    throw new Error('権限がありません')
  }
  
  // 3. データ更新
  await db.post.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
    }
  })
  
  revalidatePath(`/posts/${id}`)
}
```

### 7.3 CSRF 対策

```tsx
// ✅ Server Actions は自動的に CSRF 対策される
// 特別な対策は不要（Next.js が自動で処理）

// API Routes を使う場合は手動で対策が必要
// app/api/posts/route.ts
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // Origin チェック
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  
  if (origin && new URL(origin).host !== host) {
    return new Response('Forbidden', { status: 403 })
  }
  
  // 処理続行
}
```

## 📊 8. エラーハンドリングとUX

### 8.1 フォームエラーの表示

```tsx
// ✅ 詳細なエラー表示
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
        />
        <div id="title-error" aria-live="polite" aria-atomic="true">
          {state.errors?.title?.map((error: string) => (
            <p key={error} className="text-red-500 text-sm">
              {error}
            </p>
          ))}
        </div>
      </div>
      
      <button type="submit">投稿</button>
      
      {state.message && (
        <div aria-live="polite" className="text-green-500">
          {state.message}
        </div>
      )}
    </form>
  )
}
```

### 8.2 トーストによる通知

```tsx
// ✅ トースト通知の実装
'use client'

import { toast } from 'sonner'
import { deletePost } from './actions'

const DeleteButton = ({ postId }: { postId: string }) => {
  const handleDelete = async () => {
    try {
      toast.loading('削除中...')
      await deletePost(postId)
      toast.success('削除しました')
    } catch (error) {
      toast.error('削除に失敗しました')
    }
  }
  
  return (
    <button onClick={handleDelete}>
      削除
    </button>
  )
}
```

### 8.3 リトライ機能

```tsx
// ✅ リトライ機能の実装
'use client'

import { useState } from 'react'

const RetryableForm = () => {
  const [retryCount, setRetryCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
      })
      
      if (!response.ok) throw new Error('送信失敗')
      
      // 成功
      setRetryCount(0)
      setError(null)
    } catch (err) {
      setError('送信に失敗しました')
      setRetryCount(retryCount + 1)
    }
  }
  
  return (
    <div>
      <form action={handleSubmit}>
        {/* フォームフィールド */}
        <button type="submit">送信</button>
      </form>
      
      {error && (
        <div>
          <p className="text-red-500">{error}</p>
          {retryCount < 3 && (
            <button onClick={() => handleSubmit(new FormData())}>
              再試行 ({retryCount}/3)
            </button>
          )}
        </div>
      )}
    </div>
  )
}
```

## 📝 9. まとめ: データ更新のチェックリスト

### ✅ 設計時

- [ ] Server Actions を優先的に検討したか？
- [ ] Progressive Enhancement を考慮したか？
- [ ] 適切なキャッシュ再検証戦略を選んだか？
- [ ] 認証・認可が必要か確認したか？

### ✅ 実装時

- [ ] サーバー側でバリデーションを実装したか？
- [ ] エラーハンドリングを実装したか？
- [ ] ローディング状態を表示しているか？
- [ ] 型安全性を確保したか（Zod など）？

### ✅ UX 改善

- [ ] 楽観的更新を検討したか？
- [ ] 適切なフィードバックを提供しているか？
- [ ] エラー時のリトライ機能があるか？
- [ ] アクセシビリティを考慮したか？

## 📚 参考リンク

- [Zenn - Next.js 15 / React 19 実践設計ガイド 第4章](https://zenn.dev/k_mori/books/24320553af0956/viewer/9bce66)
- [Next.js - Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Next.js - Revalidating Data](https://nextjs.org/docs/app/building-your-application/caching#revalidating)
- [React - useFormState](https://react.dev/reference/react-dom/hooks/useFormState)
- [React - useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus)

---

**更新日:** 2025-11-11  
**対象バージョン:** Next.js 15.x, React 19.x



