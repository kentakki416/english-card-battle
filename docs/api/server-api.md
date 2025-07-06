# サーバーAPI仕様書

## 概要
このドキュメントは、English Card BattleアプリケーションのサーバーAPI仕様を定義します。

## 共通仕様

### 認証
- JWTトークンを使用した認証
- クッキーベースのトークン管理
- APIトークンによる内部認証

### レスポンス形式
```typescript
// 成功時
{
  status: 200,
  data: T,
  token?: string,
  responsedAt: Date
}

// エラー時
{
  status: 400 | 404 | 500,
  message: string,
  responsedAt: Date
}
```

## API一覧

### 認証系API

| エンドポイント | メソッド | 認証 | 説明 | リクエスト | レスポンス |
|---|---|---|---|---|---|
| `/api/auth/signup` | POST | API Token | ユーザー登録 | `SignupRequest` | `SignupResponse` |
| `/api/auth/login` | POST | API Token | ユーザーログイン | `LoginRequest` | `LoginResponse` |
| `/api/auth/logout` | POST | JWT | ユーザーログアウト | - | `LogoutResponse` |
| `/api/auth/refresh` | POST | JWT | トークン更新 | - | `RefreshResponse` |

### ユーザー系API

| エンドポイント | メソッド | 認証 | 説明 | リクエスト | レスポンス |
|---|---|---|---|---|---|
| `/api/users/profile` | GET | JWT | プロフィール取得 | - | `ProfileResponse` |
| `/api/users/profile` | PUT | JWT | プロフィール更新 | `UpdateProfileRequest` | `ProfileResponse` |
| `/api/users/level-up` | POST | JWT | レベルアップ | - | `LevelUpResponse` |
| `/api/users/stats` | GET | JWT | 統計情報取得 | - | `StatsResponse` |

### 問題系API

| エンドポイント | メソッド | 認証 | 説明 | リクエスト | レスポンス |
|---|---|---|---|---|---|
| `/api/questions` | GET | JWT | 問題一覧取得 | `QuestionsRequest` | `QuestionsResponse` |
| `/api/questions/:id` | GET | JWT | 問題詳細取得 | - | `QuestionResponse` |
| `/api/questions/random` | GET | JWT | ランダム問題取得 | `RandomQuestionRequest` | `QuestionResponse` |
| `/api/questions/daily` | GET | JWT | 今日の問題取得 | - | `QuestionResponse` |

### 回答系API

| エンドポイント | メソッド | 認証 | 説明 | リクエスト | レスポンス |
|---|---|---|---|---|---|
| `/api/answers` | POST | JWT | 回答送信 | `AnswerRequest` | `AnswerResponse` |
| `/api/answers/history` | GET | JWT | 回答履歴取得 | `AnswerHistoryRequest` | `AnswerHistoryResponse` |
| `/api/answers/stats` | GET | JWT | 回答統計取得 | - | `AnswerStatsResponse` |

## リクエスト/レスポンス型定義

### 認証系

#### SignupRequest
```typescript
{
  name: string
  password: string
  confirmPassword: string
  gender: string
}
```

#### SignupResponse
```typescript
{
  id: string
  name: string
  gender: string
  profilePic: string
}
```

#### LoginRequest
```typescript
{
  name: string
  password: string
}
```

#### LoginResponse
```typescript
{
  id: string
  name: string
  gender: string
  profilePic: string
  level: number
  experience: number
}
```

### ユーザー系

#### ProfileResponse
```typescript
{
  id: string
  name: string
  gender: string
  profilePic: string
  level: number
  experience: number
  totalQuestions: number
  correctAnswers: number
  streakDays: number
  createdAt: Date
}
```

#### UpdateProfileRequest
```typescript
{
  name?: string
  gender?: string
  profilePic?: string
}
```

#### LevelUpResponse
```typescript
{
  previousLevel: number
  currentLevel: number
  experienceGained: number
  rewards: Reward[]
}
```

#### StatsResponse
```typescript
{
  totalQuestions: number
  correctAnswers: number
  accuracyRate: number
  streakDays: number
  averageTime: number
  rank: number
}
```

### 問題系

#### QuestionsRequest
```typescript
{
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  limit?: number
  offset?: number
}
```

#### QuestionsResponse
```typescript
{
  questions: Question[]
  total: number
  hasMore: boolean
}
```

#### QuestionResponse
```typescript
{
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  imageUrl?: string
}
```

#### RandomQuestionRequest
```typescript
{
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  excludeIds?: string[]
}
```

### 回答系

#### AnswerRequest
```typescript
{
  questionId: string
  selectedAnswer: string
  timeSpent: number
}
```

#### AnswerResponse
```typescript
{
  isCorrect: boolean
  correctAnswer: string
  explanation: string
  experienceGained: number
  levelUp?: LevelUpInfo
}
```

#### AnswerHistoryRequest
```typescript
{
  limit?: number
  offset?: number
  dateFrom?: Date
  dateTo?: Date
}
```

#### AnswerHistoryResponse
```typescript
{
  answers: AnswerHistory[]
  total: number
  hasMore: boolean
}
```

#### AnswerStatsResponse
```typescript
{
  totalAnswers: number
  correctAnswers: number
  accuracyRate: number
  averageTime: number
  categoryStats: CategoryStat[]
  dailyStats: DailyStat[]
}
```

## 共通型定義

### Question
```typescript
{
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  imageUrl?: string
  createdAt: Date
}
```

### AnswerHistory
```typescript
{
  id: string
  questionId: string
  selectedAnswer: string
  isCorrect: boolean
  timeSpent: number
  answeredAt: Date
}
```

### Reward
```typescript
{
  type: 'experience' | 'item' | 'badge'
  value: number | string
  description: string
}
```

### LevelUpInfo
```typescript
{
  previousLevel: number
  currentLevel: number
  experienceGained: number
}
```

### CategoryStat
```typescript
{
  category: string
  totalQuestions: number
  correctAnswers: number
  accuracyRate: number
}
```

### DailyStat
```typescript
{
  date: string
  questionsAnswered: number
  correctAnswers: number
  accuracyRate: number
}
```

## エラーレスポンス

### 400 Bad Request
```typescript
{
  status: 400,
  message: "Invalid request parameters",
  responsedAt: Date
}
```

### 401 Unauthorized
```typescript
{
  status: 401,
  message: "Authentication required",
  responsedAt: Date
}
```

### 404 Not Found
```typescript
{
  status: 404,
  message: "Resource not found",
  responsedAt: Date
}
```

### 500 Internal Server Error
```typescript
{
  status: 500,
  message: "Internal server error",
  responsedAt: Date
}
```

## 実装ステータス

| API | ステータス | 実装予定 |
|---|---|---|
| `/api/auth/signup` | ✅ 実装済み | - |
| `/api/auth/login` | ❌ 未実装 | Phase 1 |
| `/api/auth/logout` | ❌ 未実装 | Phase 1 |
| `/api/auth/refresh` | ❌ 未実装 | Phase 1 |
| `/api/users/profile` | ❌ 未実装 | Phase 2 |
| `/api/users/level-up` | ❌ 未実装 | Phase 2 |
| `/api/questions` | ❌ 未実装 | Phase 3 |
| `/api/answers` | ❌ 未実装 | Phase 3 |
