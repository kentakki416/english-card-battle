# Next.js 15 / React 19 キャッシュ戦略ガイド

第6章: キャッシュ戦略の実践的なベストプラクティス

参考: [Next.js 15 / React 19 実践設計ガイド - 第6章](https://zenn.dev/k_mori/books/24320553af0956/viewer/c862c6)

## 🗄️ 1. Next.js 15 のキャッシュシステム概要

### 1.1 キャッシュの種類

Next.js 15 では、以下の4つの主要なキャッシュレイヤーがあります：

| キャッシュ種類 | 場所 | 用途 | デフォルト |
|--------------|------|------|-----------|
| **Request Memoization** | サーバー（リクエスト内） | 同一リクエスト内の重複fetchを防ぐ | 有効 |
| **Data Cache** | サーバー（永続化） | fetch の結果をキャッシュ | 有効（force-cache） |
| **Full Route Cache** | サーバー（ビルド時） | 静的ページのHTMLをキャッシュ | 有効（静的ページ） |
| **Router Cache** | クライアント（メモリ） | ナビゲーション時のページをキャッシュ | 有効 |

### 1.2 キャッシュの階層構造

```
ユーザーリクエスト
    ↓
┌─────────────────────┐
│ Router Cache         │ ← クライアント側（メモリ）
│ (クライアント)        │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Full Route Cache     │ ← サーバー側（静的HTML）
│ (サーバー)           │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Data Cache          │ ← サーバー側（fetch結果）
│ (サーバー)          │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Request Memoization │ ← サーバー側（リクエスト内）
│ (サーバー)          │
└─────────────────────┘
```

## 📡 2. Request Memoization（リクエストメモ化）

### 2.1 基本概念

**Request Memoization** は、同一リクエスト内で同じURLへのfetch呼び出しを自動的にメモ化します。

```tsx
// ✅ 自動的にメモ化される
const PostPage = async ({ id }: { id: string }) => {
  // 1回目のfetch
  const post = await fetch(`https://api.example.com/posts/${id}`)
    .then(res => res.json())
  
  // 2回目のfetch（同じURL）→ メモ化された結果を使用
  const postAgain = await fetch(`https://api.example.com/posts/${id}`)
    .then(res => res.json())
  
  // post と postAgain は同じオブジェクト参照
  // 実際のHTTPリクエストは1回だけ実行される
}
```

### 2.2 使用ケース

```tsx
// ✅ 複数のコンポーネントで同じデータを取得
const PostPage = async ({ id }: { id: string }) => {
  return (
    <div>
      <PostHeader id={id} />
      <PostContent id={id} />
      <PostComments id={id} />
    </div>
  )
}

const PostHeader = async ({ id }: { id: string }) => {
  const post = await fetch(`https://api.example.com/posts/${id}`)
    .then(res => res.json())
  return <h1>{post.title}</h1>
}

const PostContent = async ({ id }: { id: string }) => {
  // ✅ 同じURLなので、メモ化された結果を使用
  const post = await fetch(`https://api.example.com/posts/${id}`)
    .then(res => res.json())
  return <div>{post.content}</div>
}
```

### 2.3 無効化する方法

```tsx
// ✅ Request Memoization を無効化（通常は不要）
const PostPage = async ({ id }: { id: string }) => {
  const post = await fetch(`https://api.example.com/posts/${id}`, {
    cache: 'no-store'  // Data Cache も無効化される
  }).then(res => res.json())
  
  // 別のリクエストとして扱われる
  const postAgain = await fetch(`https://api.example.com/posts/${id}`, {
    cache: 'no-store'
  }).then(res => res.json())
}
```

## 💾 3. Data Cache（データキャッシュ）

### 3.1 fetch のキャッシュオプション

#### force-cache（デフォルト）

```tsx
// ✅ 静的データ: ビルド時にキャッシュ
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

### 3.2 キャッシュ戦略の選び方

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

### 3.3 タグベースの再検証

```tsx
// ✅ タグを設定してキャッシュを管理
const PostList = async () => {
  const posts = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] }  // タグを設定
  }).then(res => res.json())
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

// Server Action でタグを再検証
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  await db.post.create({
    data: {
      title: formData.get('title') as string,
    }
  })
  
  // ✅ 'posts' タグを持つ全てのキャッシュを再検証
  revalidateTag('posts')
}
```

## 🏗️ 4. Full Route Cache（フルルートキャッシュ）

### 4.1 静的ページのキャッシュ

```tsx
// ✅ 静的ページ（デフォルトでキャッシュされる）
const StaticPage = async () => {
  const data = await fetch('https://api.example.com/data', {
    cache: 'force-cache'  // デフォルト
  }).then(res => res.json())
  
  return <div>{data.title}</div>
}

// ビルド時にHTMLが生成され、キャッシュされる
```

### 4.2 動的ページのキャッシュ無効化

```tsx
// ✅ 動的ページ: キャッシュを無効化
export const dynamic = 'force-dynamic'  // または 'auto', 'error'

const DynamicPage = async () => {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store'
  }).then(res => res.json())
  
  return <div>{data.title}</div>
}
```

### 4.3 セグメント設定

```tsx
// ✅ セグメント単位でキャッシュ設定
export const dynamic = 'force-dynamic'  // このページは動的
export const revalidate = 3600  // 1時間ごとに再生成

const BlogPost = async ({ id }: { id: string }) => {
  const post = await fetch(`https://api.example.com/posts/${id}`)
    .then(res => res.json())
  
  return <article>{post.content}</article>
}
```

## 🧭 5. Router Cache（ルーターキャッシュ）

### 5.1 基本概念

**Router Cache** は、クライアント側でナビゲーション時にページをメモリにキャッシュします。

**特徴:**
- クライアント側のメモリに保存
- ナビゲーション時の高速化
- 一時的なキャッシュ（セッション中のみ）

### 5.2 キャッシュの動作

```tsx
// ✅ ナビゲーション時の動作
// 1. ユーザーが /posts にアクセス
// 2. Router Cache に保存
// 3. 別のページに移動
// 4. /posts に戻る → Router Cache から即座に表示
```

### 5.3 キャッシュの無効化

```tsx
// ✅ router.refresh() で Router Cache を無効化
'use client'

import { useRouter } from 'next/navigation'

const RefreshButton = () => {
  const router = useRouter()
  
  const handleRefresh = () => {
    router.refresh()  // Router Cache を無効化して再取得
  }
  
  return <button onClick={handleRefresh}>更新</button>
}
```

## 🔄 6. キャッシュの再検証戦略

### 6.1 revalidatePath

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

### 6.2 revalidateTag

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
```

**使用ケース:**
- 複数の関連ページを一度に再検証したい時
- 細かいキャッシュ制御が必要な時

### 6.3 再検証戦略の比較

```tsx
// パターン1: revalidatePath（シンプル）
revalidatePath('/posts')  // /posts のみ再検証

// パターン2: revalidatePath with layout（広範囲）
revalidatePath('/posts', 'layout')  // /posts 配下の全ページを再検証

// パターン3: revalidateTag（柔軟）
revalidateTag('posts')  // 'posts' タグを持つ全てを再検証
```

## 🎯 7. 実践的なキャッシュ戦略

### 7.1 ブログサイトの例

```tsx
// ✅ ブログ記事: 定期更新
const BlogPost = async ({ slug }: { slug: string }) => {
  const post = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { revalidate: 3600 }  // 1時間ごとに更新
  }).then(res => res.json())
  
  return <article>{post.content}</article>
}

// ✅ ブログ一覧: タグベースの再検証
const BlogList = async () => {
  const posts = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] }
  }).then(res => res.json())
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

// ✅ 新規投稿時に再検証
'use server'

export async function createPost(formData: FormData) {
  await db.post.create({
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
    }
  })
  
  revalidateTag('posts')  // 一覧ページを更新
}
```

### 7.2 Eコマースサイトの例

```tsx
// ✅ 商品詳細: 動的データ（キャッシュなし）
const ProductPage = async ({ id }: { id: string }) => {
  const product = await fetch(`https://api.example.com/products/${id}`, {
    cache: 'no-store'  // 在庫情報などは常に最新
  }).then(res => res.json())
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>在庫: {product.stock}</p>
      <p>価格: ¥{product.price}</p>
    </div>
  )
}

// ✅ 商品一覧: 定期更新
const ProductList = async () => {
  const products = await fetch('https://api.example.com/products', {
    next: { revalidate: 300 }  // 5分ごとに更新
  }).then(res => res.json())
  
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

### 7.3 ダッシュボードの例

```tsx
// ✅ ユーザー固有のデータ: キャッシュなし
const Dashboard = async () => {
  const session = await auth()
  
  const userData = await fetch(`https://api.example.com/users/${session.user.id}`, {
    cache: 'no-store'  // ユーザー固有なのでキャッシュしない
  }).then(res => res.json())
  
  return <div>Welcome, {userData.name}!</div>
}

// ✅ 統計データ: 定期更新
const Stats = async () => {
  const stats = await fetch('https://api.example.com/stats', {
    next: { revalidate: 60 }  // 1分ごとに更新
  }).then(res => res.json())
  
  return (
    <div>
      <p>総ユーザー数: {stats.totalUsers}</p>
      <p>今日のアクセス: {stats.todayViews}</p>
    </div>
  )
}
```

## 🚀 8. パフォーマンス最適化

### 8.1 並列データ取得の最適化

```tsx
// ✅ 並列取得で Request Memoization を活用
const Dashboard = async () => {
  // 並列に取得（Request Memoization で重複を防ぐ）
  const [user, posts, comments] = await Promise.all([
    fetch('https://api.example.com/user').then(res => res.json()),
    fetch('https://api.example.com/posts').then(res => res.json()),
    fetch('https://api.example.com/comments').then(res => res.json()),
  ])
  
  return (
    <div>
      <UserProfile user={user} />
      <PostList posts={posts} />
      <CommentList comments={comments} />
    </div>
  )
}
```

### 8.2 部分的なキャッシュ無効化

```tsx
// ✅ 必要な部分だけ再検証
'use server'

export async function updatePost(id: string, formData: FormData) {
  await db.post.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
    }
  })
  
  // ✅ 更新された記事だけ再検証
  revalidatePath(`/posts/${id}`)
  
  // 一覧ページは再検証しない（パフォーマンス向上）
  // 必要に応じて revalidateTag('posts') を追加
}
```

### 8.3 キャッシュの事前生成

```tsx
// ✅ generateStaticParams で事前にキャッシュ
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts')
    .then(res => res.json())
  
  return posts.map((post: Post) => ({
    id: post.id,
  }))
}

// ビルド時に全ての記事ページがキャッシュされる
const PostPage = async ({ id }: { id: string }) => {
  const post = await fetch(`https://api.example.com/posts/${id}`)
    .then(res => res.json())
  
  return <article>{post.content}</article>
}
```

## 🔍 9. キャッシュのデバッグ

### 9.1 キャッシュ状態の確認

```tsx
// ✅ キャッシュの状態を確認
const PostPage = async ({ id }: { id: string }) => {
  const response = await fetch(`https://api.example.com/posts/${id}`, {
    next: { revalidate: 3600 }
  })
  
  // キャッシュの状態を確認
  console.log('Cache status:', response.headers.get('x-cache'))
  
  const post = await response.json()
  return <article>{post.content}</article>
}
```

### 9.2 開発環境での確認

```tsx
// ✅ 開発環境でキャッシュを無効化
const PostPage = async ({ id }: { id: string }) => {
  const post = await fetch(`https://api.example.com/posts/${id}`, {
    cache: process.env.NODE_ENV === 'development' 
      ? 'no-store'  // 開発環境ではキャッシュなし
      : 'force-cache'  // 本番環境ではキャッシュ
  }).then(res => res.json())
  
  return <article>{post.content}</article>
}
```

## 📝 10. まとめ: キャッシュ戦略のチェックリスト

### ✅ 設計時

- [ ] データの性質（静的/動的）を判断したか？
- [ ] 適切なキャッシュ戦略を選んだか？
- [ ] 再検証のタイミングを決めたか？
- [ ] タグベースの再検証を検討したか？

### ✅ 実装時

- [ ] fetch のキャッシュオプションを適切に設定したか？
- [ ] revalidatePath / revalidateTag を実装したか？
- [ ] 動的ページの設定（dynamic, revalidate）を確認したか？
- [ ] エラーハンドリングを実装したか？

### ✅ 最適化

- [ ] 不要なキャッシュを無効化したか？
- [ ] 並列データ取得を活用したか？
- [ ] 部分的な再検証を検討したか？
- [ ] パフォーマンスを計測したか？

## 📚 参考リンク

- [Zenn - Next.js 15 / React 19 実践設計ガイド 第6章](https://zenn.dev/k_mori/books/24320553af0956/viewer/c862c6)
- [Next.js - Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Next.js - Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js - Revalidating Data](https://nextjs.org/docs/app/building-your-application/caching#revalidating)

---

**更新日:** 2025-11-11  
**対象バージョン:** Next.js 15.x, React 19.x



