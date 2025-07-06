# Google認証実装ガイド

## 必要な準備

### 1. Google Cloud Console での設定
```
1. https://console.cloud.google.com/ にアクセス
2. プロジェクトを作成または選択
3. 「APIとサービス」→「認証情報」に移動
4. 「認証情報を作成」→「OAuth 2.0 クライアントID」を選択
5. アプリケーションの種類を「ウェブアプリケーション」に設定
6. 承認済みのリダイレクトURIを設定
   - 開発環境: http://localhost:3000/api/auth/callback/google
   - 本番環境: https://your-domain.com/api/auth/callback/google
7. Client IDとClient Secretを取得
```

#### Googleの設定項目
OAuth2.0の設定
* 承認済みのJavaScript生成元
   * クライアントサイドでのOAuth認証を許可するドメインを指定
* 承認済みのリダイレクトURI
   * 認証完了後にユーザーをリダイレクトするURLを指å定

### 2. 必要なパッケージ

#### フロントエンド（Next.js）
```bash
npm install next-auth
```

#### バックエンド（Node.js）
```bash
npm install jsonwebtoken axios
npm install --save-dev @types/jsonwebtoken
```

## 認証フロー

### 1. フロントエンド（クライアント）
```
ユーザーが「Googleでログイン」ボタンをクリック
↓
NextAuth.jsがGoogleの認証ページにリダイレクト
↓
ユーザーがGoogleでログイン
↓
Googleが認証コードをアプリに返す
↓
NextAuth.jsが認証コードをバックエンドに送信
```

### 2. バックエンド（サーバー）
```
認証コードを受け取る
↓
Google APIでアクセストークンを取得
↓
アクセストークンでユーザー情報を取得
↓
データベースにユーザー情報を保存
↓
JWTトークンを生成してフロントエンドに返す
```

## 環境変数

### フロントエンド（.env.local）
```env
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
```

### バックエンド（.env）
```env
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=mongodb://localhost:27017/english_card_battle
```

## 実装の流れ

### 1. フロントエンド実装
- NextAuth.jsの設定
- ログインボタンの作成
- セッション管理

### 2. バックエンド実装
- Google APIとの連携
- ユーザー情報の取得・保存
- JWTトークンの生成

### 3. データベース設計
- ユーザーテーブルの作成
- 認証トークンテーブルの作成

## セキュリティ注意点
- Client Secretはフロントエンドに露出させない
- JWT Secretは強力な秘密鍵を使用
- 適切なトークン有効期限を設定 
