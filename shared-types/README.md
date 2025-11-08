# Shared Types

API、Web、Nativeで共有する型定義とスキーマを提供するパッケージです。

## 特徴

- **Zodベース**: ランタイムバリデーションと型安全性を両立
- **エラー定義**: すべてのエラーコードとメッセージを一元管理
- **API定義**: リクエスト・レスポンスの型を統一

## インストール

```bash
npm install
npm run build
```

## 使用方法

### エラー定義

```typescript
import { USER_ERRORS, UserError } from 'shared-types'

// サーバー側で使用
const error = USER_ERRORS.USER_NOT_FOUND
console.log(error.errorCode) // 1003

// クライアント側でバリデーション
import { UserErrorSchema } from 'shared-types'
const result = UserErrorSchema.safeParse(response)
```

### API定義

```typescript
import { LoginRequest, LoginResponse, LoginRequestSchema } from 'shared-types'

// リクエストのバリデーション
const validatedData = LoginRequestSchema.parse(req.body)
```

## 開発

```bash
npm run dev  # ウォッチモードでビルド
```

