# 英語学習機能実装計画

## 概要
EnglishStudy.mdの仕様に基づき、英単語の学習機能を実装します。
エンドポイント: `POST /study/english`

## 仕様詳細
- 英単語はエンジニアがよく使う英語を100個DBに保存
- ランダムに10個取得して出題
- DBには英単語、正解、選択肢を保存
- ユーザーは正解・不正解の履歴を確認可能

## 🔄 アーキテクチャの改善（2024年実施）
効率性を向上させるため、正解判定のロジックをサーバー側からクライアント側に移行：

### 変更前（非効率）:
1. クライアント: 問題を取得（正解なし）
2. クライアント: 回答を送信
3. サーバー: 各回答ごとにDBから問題を取得して正解判定
4. サーバー: 履歴を保存
5. サーバー: 結果を返却

### 変更後（効率的）:
1. クライアント: 問題を取得（**正解も含む**）
2. クライアント: 全問回答して**クライアント側で正解判定**
3. クライアント: 判定済みの結果をサーバーに送信
4. サーバー: 結果をそのまま履歴に保存して返却

**メリット:**
- サーバーへのリクエスト回数が大幅削減
- DBアクセスの削減（問題取得クエリが不要）
- レスポンス速度の向上
- サーバー負荷の軽減

---

## 作業手順

### フェーズ1: 型定義とAPI仕様策定（shared-types）

#### 1.1 EnglishStudy APIの型定義
**ファイル**: `packages/shared-types/src/api/english-study.ts`

**必要な型**:
- `EnglishStudyRequestSchema`: リクエストスキーマ
  - `userId`: ユーザーID（string）
  
- `EnglishStudyResponseSchema`: レスポンススキーマ
  - `questions`: 問題の配列
    - `questionId`: 問題ID（string）
    - `word`: 英単語（string）
    - `choices`: 選択肢の配列（string[]）
  
- `SubmitAnswerRequestSchema`: 回答送信リクエスト
  - `userId`: ユーザーID（string）
  - `answers`: 回答の配列
    - `questionId`: 問題ID（string）
    - `selectedAnswer`: 選択した回答（string）
    
- `SubmitAnswerResponseSchema`: 回答結果レスポンス
  - `results`: 結果の配列
    - `questionId`: 問題ID（string）
    - `isCorrect`: 正解かどうか（boolean）
    - `correctAnswer`: 正解（string）
  - `score`: スコア（number）

#### 1.2 エラー型定義
**ファイル**: `packages/shared-types/src/errors/english-study.ts`

**必要なエラー型**:
- `ENGLISH_STUDY_ERRORS`
  - `QUESTION_NOT_FOUND`: 問題が見つからない
  - `INVALID_ANSWER`: 無効な回答
  - `INSUFFICIENT_QUESTIONS`: 問題数が不足

#### 1.3 Domain型定義
**ファイル**: `packages/shared-types/src/domain/english-study.ts`（新規）

**必要な型**:
- `EnglishWord`: 英単語のドメイン型
- `StudyHistory`: 学習履歴のドメイン型

#### 1.4 インデックスファイルの更新
**ファイル**: 
- `packages/shared-types/src/api/index.ts`
- `packages/shared-types/src/errors/index.ts`
- `packages/shared-types/src/index.ts`

---

### フェーズ2: Domain層の実装（api-server）

#### 2.1 EnglishWordエンティティ
**ファイル**: `apps/api-server/src/domain/entity/english_word.ts`

**責務**:
- 英単語のドメインオブジェクト
- バリデーションロジック
- ファクトリーメソッド

**プロパティ**:
- `id`: string
- `word`: string（英単語）
- `correctAnswer`: string（正解の日本語訳）
- `choices`: string[]（選択肢）
- `difficulty`: number（難易度、オプション）
- `category`: string（カテゴリ、オプション）

#### 2.2 StudyHistoryエンティティ
**ファイル**: `apps/api-server/src/domain/entity/study_history.ts`

**責務**:
- 学習履歴のドメインオブジェクト

**プロパティ**:
- `id`: string
- `userId`: string
- `questionId`: string
- `isCorrect`: boolean
- `selectedAnswer`: string
- `studiedAt`: Date

---

### フェーズ3: Infrastructure層の実装（api-server）

#### 3.1 MongoDBスキーマ定義
**ファイル**: `apps/api-server/types/mongo/english_word.ts`

**内容**:
- `EnglishWordCollection`: MongoDBのコレクションスキーマ
- `StudyHistoryCollection`: 学習履歴のコレクションスキーマ

#### 3.2 EnglishWordリポジトリ
**ファイル**: `apps/api-server/src/infrastructure/db/repository/english_word_repository.ts`

**メソッド**:
- `findRandom(count: number)`: ランダムにN個取得
- `findById(id: string)`: IDで取得
- `save(word: EnglishWord)`: 保存
- `bulkSave(words: EnglishWord[])`: 一括保存

#### 3.3 StudyHistoryリポジトリ
**ファイル**: `apps/api-server/src/infrastructure/db/repository/study_history_repository.ts`

**メソッド**:
- `save(history: StudyHistory)`: 履歴保存
- `findByUserId(userId: string)`: ユーザーの履歴取得
- `bulkSave(histories: StudyHistory[])`: 一括保存

#### 3.4 リポジトリインターフェース
**ファイル**: 
- `apps/api-server/src/adapter/interface/repository/ienglish_word_repository.ts`
- `apps/api-server/src/adapter/interface/repository/istudy_history_repository.ts`

---

### フェーズ4: Usecase層の実装（api-server）

#### 4.1 GetEnglishQuestionsUsecase
**ファイル**: `apps/api-server/src/usecase/study/get_english_questions_usecase.ts`

**責務**:
- 英単語の問題を10個ランダムに取得
- ビジネスロジックの実行

**処理フロー**:
1. EnglishWordリポジトリから10個ランダム取得
2. 問題が10個未満ならエラー
3. レスポンス形式に変換して返却

#### 4.2 SubmitEnglishAnswersUsecase
**ファイル**: `apps/api-server/src/usecase/study/submit_english_answers_usecase.ts`

**責務**:
- 回答の採点
- 学習履歴の保存

**処理フロー**:
1. 回答の検証
2. 正解・不正解の判定
3. StudyHistoryに保存
4. スコアと結果を返却

---

### フェーズ5: Adapter層の実装（api-server）

#### 5.1 GetEnglishQuestionsController
**ファイル**: `apps/api-server/src/adapter/controller/study/get_english_questions_controller.ts`

**責務**:
- リクエストの受け取り
- Usecaseの呼び出し
- エラーハンドリング

#### 5.2 SubmitEnglishAnswersController
**ファイル**: `apps/api-server/src/adapter/controller/study/submit_english_answers_controller.ts`

**責務**:
- 回答リクエストの受け取り
- Usecaseの呼び出し
- エラーハンドリング

#### 5.3 Serializer
**ファイル**: 
- `apps/api-server/src/adapter/serializer/study/get_english_questions_serializer.ts`
- `apps/api-server/src/adapter/serializer/study/submit_english_answers_serializer.ts`

**責務**:
- リクエストのパース
- レスポンスのシリアライズ
- エラーレスポンスの生成

---

### フェーズ6: Router設定（api-server）

#### 6.1 StudyRouter
**ファイル**: `apps/api-server/src/infrastructure/router/study_router.ts`

**内容**:
- `POST /english`: 問題取得
- `POST /english/answer`: 回答送信

#### 6.2 ExpressRouterへの追加
**ファイル**: `apps/api-server/src/infrastructure/router/router.ts`

**変更内容**:
- StudyRouterの追加
- `/study`パスへのマウント

---

### フェーズ7: DIContainerの更新（api-server）

#### 7.1 DIContainerへの依存性追加
**ファイル**: `apps/api-server/src/infrastructure/di/di_container.ts`

**追加する依存性**:
- EnglishWordRepository
- StudyHistoryRepository
- GetEnglishQuestionsUsecase
- SubmitEnglishAnswersUsecase
- GetEnglishQuestionsController
- SubmitEnglishAnswersController
- Serializers

---

### フェーズ8: テストコードの実装（api-server）

#### 8.1 Entityのテスト
**ファイル**: 
- `apps/api-server/test/domain/entity/english_word.test.ts`
- `apps/api-server/test/domain/entity/study_history.test.ts`

**テストケース**:
- 正常系: エンティティの生成と検証
- 異常系: バリデーションエラー

#### 8.2 Repositoryのテスト
**ファイル**: 
- `apps/api-server/test/infrastructure/db/repository/english_word_repository.test.ts`
- `apps/api-server/test/infrastructure/db/repository/study_history_repository.test.ts`

**テストケース**:
- ランダム取得の動作確認
- 保存・取得の動作確認

#### 8.3 Usecaseのテスト
**ファイル**: 
- `apps/api-server/test/usecase/study/get_english_questions_usecase.test.ts`
- `apps/api-server/test/usecase/study/submit_english_answers_usecase.test.ts`

**テストケース**:
- 正常系: 10個の問題取得、正解判定
- 異常系: 問題数不足、無効な回答

#### 8.4 Controllerのテスト
**ファイル**: 
- `apps/api-server/test/adapter/controller/study/get_english_questions_controller.test.ts`
- `apps/api-server/test/adapter/controller/study/submit_english_answers_controller.test.ts`

**テストケース**:
- 正常系: リクエスト処理
- 異常系: エラーハンドリング

#### 8.5 統合テスト
**ファイル**: `apps/api-server/test/integration/study.test.ts`

**テストケース**:
- エンドポイントの疎通確認
- エンドツーエンドのフロー確認

---

### フェーズ9: データシーディング（オプション）

#### 9.1 初期データの投入
**ファイル**: `apps/api-server/src/infrastructure/seed/english_words_seed.ts`

**内容**:
- エンジニアがよく使う英単語100個のデータ
- 各単語の正解と選択肢

---

## 実装順序のまとめ

1. **shared-types**: 型定義・API仕様（フェーズ1）
2. **api-server**: 
   - Domain層（フェーズ2）
   - Infrastructure層（フェーズ3）
   - Usecase層（フェーズ4）
   - Adapter層（フェーズ5）
   - Router設定（フェーズ6）
   - DIContainer更新（フェーズ7）
   - テストコード（フェーズ8）
3. **オプション**: データシーディング（フェーズ9）

---

## 注意事項

- 既存のコードスタイル（Google Login機能）に合わせる
- Result型を使用したエラーハンドリング
- クリーンアーキテクチャの原則を守る
- すべての機能にテストコードを実装
- Zodスキーマでバリデーション

---

## 完了条件

- [ ] shared-typesの型定義が完了
- [ ] api-serverの全レイヤーの実装が完了
- [ ] テストコードが全て作成され、パスする
- [ ] エンドポイントが正常に動作する
- [ ] コードレビューが完了

