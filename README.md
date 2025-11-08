# English Card Battle
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">English Card Battle</h3>

  <p align="center">
    エンジニアが楽しみながら英語を学べるカードバトルアプリケーション
    <br />
    <a href="#about-the-project"><strong>詳細を見る »</strong></a>
    <br />
    <br />
    <a href="#report-bug">バグ報告</a>
    ·
    <a href="#request-feature">機能リクエスト</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>目次</summary>
  <ol>
    <li>
      <a href="#about-the-project">プロジェクトについて</a>
      <ul>
        <li><a href="#features">主な機能</a></li>
        <li><a href="#architecture">アーキテクチャ</a></li>
      </ul>
    </li>
    <li>
      <a href="#tech-stack">技術スタック</a>
      <ul>
        <li><a href="#frontend">フロントエンド</a></li>
        <li><a href="#backend">バックエンド</a></li>
        <li><a href="#infrastructure">インフラストラクチャ</a></li>
      </ul>
    </li>
    <li><a href="#project-structure">プロジェクト構成</a></li>
    <li><a href="#getting-started">セットアップ</a></li>
    <li><a href="#development">開発</a></li>
    <li><a href="#license">ライセンス</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## プロジェクトについて

English Card Battleは、エンジニアが楽しみながら英語を学べるカードバトルアプリケーションです。リアルタイムバトルとソロ学習の両方に対応し、効率的な英語学習をサポートします。

### 主な機能

- **リアルタイムバトル**: 他のユーザーとリアルタイムで対戦し、英語力を競い合う
- **ソロ学習**: 自分のペースで英語学習を進められる
- **カードシステム**: 動物のカードを使用した楽しい学習体験
- **認証システム**: 安全なユーザー管理とセッション管理

### アーキテクチャ

このプロジェクトは**クリーンアーキテクチャ**と**ドメイン駆動設計**の原則に基づいて構築されています：

- **ドメイン層**: ビジネスロジックとエンティティ
- **ユースケース層**: アプリケーションのビジネスルール
- **アダプター層**: 外部システムとのインターフェース
- **インフラストラクチャ層**: データベース、外部API、フレームワーク

<p align="right">(<a href="#readme-top">トップに戻る</a>)</p>

## 開発ルール

### ブランチ命名規則

このプロジェクトでは、ブランチ名のプレフィックスにより、GitHub Actionsが自動的にラベルを付与します。
詳しくはlabeler.ymlを参照してください。

#### ブランチ名の形式
```
<type>/<description>
```

#### プレフィックスの種類

| プレフィックス | 説明 | 自動付与ラベル |
|---------------|------|---------------|
| `feat/` | 新機能の追加 | `feature` |
| `fix/` | バグ修正 | `bug` |
| `enh/` | 機能の改善・強化 | `enhancement` |
| `refactor/` | リファクタリング | `refactor` |
| `docs/` | ドキュメントの更新 | `docs` |
| `ci/` | CIの更新 | `ci` |

#### 例
```bash
# 新機能の追加
git checkout -b feat/user-authentication

# バグ修正
git checkout -b fix/login-error

# 機能の改善
git checkout -b enh/performance-optimization

# リファクタリング
git checkout -b refactor/clean-architecture

# ドキュメント更新
git checkout -b docs/api-documentation
```

## 技術スタック

### プロジェクト管理

<div style="display: flex; gap: 10px; flex-wrap: wrap; margin: 20px 0;">
  <img src="https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo" />
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
</div>

- **Turborepo**: 高速なビルドとキャッシュを提供するmonorepoツール
- **pnpm**: 効率的なディスク使用とインストール速度を実現するパッケージマネージャー

### フロントエンド

<div style="display: flex; gap: 10px; flex-wrap: wrap; margin: 20px 0;">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
</div>

- **Next.js 14**: App Routerを使用した最新のReactフレームワーク
- **TypeScript**: 型安全性を確保した開発
- **Tailwind CSS**: 効率的なスタイリング
- **shadcn/ui**: 再利用可能なUIコンポーネント

### バックエンド

<div style="display: flex; gap: 10px; flex-wrap: wrap; margin: 20px 0;">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT" />
</div>

- **Node.js**: サーバーサイドJavaScriptランタイム
- **Express.js**: Webアプリケーションフレームワーク
- **MongoDB**: NoSQLデータベース
- **JWT**: 認証トークン管理
- **クリーンアーキテクチャ**: 保守性とテスタビリティを重視した設計

### インフラストラクチャ

<div style="display: flex; gap: 10px; flex-wrap: wrap; margin: 20px 0;">
  <img src="https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
  <img src="https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white" alt="Terraform" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />
</div>

- **AWS ECS**: コンテナオーケストレーション
- **AWS ALB**: ロードバランサー
- **AWS VPC**: ネットワーク分離
- **Terraform**: インフラストラクチャのコード化
- **Docker**: コンテナ化
- **GitHub Actions**: CI/CDパイプライン

<p align="right">(<a href="#readme-top">トップに戻る</a>)</p>

## プロジェクト構成

このプロジェクトは **Turborepo + pnpm** を使用したmonorepo構成です。

```
english-card-battle/
├── apps/                    # アプリケーション
│   ├── admin/              # 管理画面 (Next.js 15)
│   ├── web/                # メインアプリ (Next.js 14)
│   └── api-server/         # バックエンドAPI (Node.js + Express)
│       ├── src/
│       │   ├── adapter/      # アダプター層
│       │   ├── domain/       # ドメイン層
│       │   ├── usecase/      # ユースケース層
│       │   └── infrastructure/ # インフラ層
│       └── test/             # テストファイル
├── packages/               # 共有パッケージ
│   └── shared-types/       # 共有型定義
├── infrastructure/         # インフラストラクチャ
│   └── cdk-terraform/      # AWS CDK for Terraform
├── eslint.config.base.mjs # 共通ESLint設定（Flat Config）
├── tsconfig.base.json     # 共通TypeScript設定
├── pnpm-workspace.yaml    # pnpmワークスペース設定
├── turbo.json             # Turborepo設定
└── package.json           # ルートpackage.json
```

### アーキテクチャ詳細

#### フロントエンド構成
- **App Router**: Next.js 14の新しいルーティングシステム
- **shadcn/ui**: 統一されたUIコンポーネント
- **Tailwind CSS**: ユーティリティファーストCSS

#### バックエンド構成
- **クリーンアーキテクチャ**: 依存関係の方向を制御
- **ドメイン駆動設計**: ビジネスロジックの明確な分離
- **依存性注入**: テスタビリティの向上

#### インフラ構成
- **Terraform**: インフラのコード化とバージョン管理
- **ECS Fargate**: サーバーレスコンテナ実行環境
- **ALB**: 高可用性ロードバランシング

<p align="right">(<a href="#readme-top">トップに戻る</a>)</p>

## セットアップ

### 前提条件

- Node.js 18以上
- pnpm 8以上
- Docker
- MongoDB（ローカル開発用）

### インストール手順

1. リポジトリのクローン
   ```bash
   git clone https://github.com/your-username/english-card-battle.git
   cd english-card-battle
   ```

2. 依存関係のインストール（ルートで一括インストール）
   ```bash
   pnpm install
   ```

3. 環境変数の設定
   ```bash
   # apps/web/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:3001
   
   # apps/api-server/.env
   MONGODB_URI=mongodb://localhost:27017/english-card-battle
   JWT_SECRET=your-secret-key
   PORT=3001
   ```

### 開発サーバーの起動

```bash
# すべてのアプリケーションを起動
pnpm dev

# 特定のアプリケーションのみ起動
pnpm --filter admin dev      # 管理画面
pnpm --filter client dev     # メインアプリ
pnpm --filter api-server dev # バックエンドAPI
```

## 環境変数の設定

### Next.js（web/admin）側

1. 各アプリの`.env.example`を`.env.local`にコピー
2. 必要な値を設定

```bash
# Webアプリ
cp apps/web/.env.example apps/web/.env.local

# 管理画面
cp apps/admin/.env.example apps/admin/.env.local
```

### Express.js（api-server）側

1. `apps/api-server/.env.example`を`apps/api-server/.env.local`にコピー
2. 必要な値を設定

```bash
cp apps/api-server/.env.example apps/api-server/.env.local
```

### 必要な環境変数

#### Next.js側
- `NEXTAUTH_SECRET`: NextAuth.jsのシークレットキー
- `GOOGLE_OAUTH_CLIENT_ID`: Google OAuthのクライアントID
- `GOOGLE_OAUTH_CLIENT_SECRET`: Google OAuthのクライアントシークレット
- `API_SERVER_URL`: APIサーバーのURL

#### Express.js側
- `JWT_SECRET`: JWTトークンのシークレットキー
- `DB_NAME`: データベース名
- `FRONTEND_URL`: フロントエンドのURL

## 開発

### Monorepoコマンド

```bash
# すべてのパッケージをビルド
pnpm build

# すべてのパッケージでlintを実行
pnpm lint

# すべてのパッケージでlintを修正
pnpm lint:fix

# すべてのパッケージでテストを実行
pnpm test
```

### 個別パッケージのコマンド

```bash
# 特定のパッケージでコマンドを実行
pnpm --filter <package-name> <command>

# 例：
pnpm --filter admin build      # adminアプリをビルド
pnpm --filter client test      # webアプリのテストを実行
pnpm --filter api-server lint  # api-serverでlintを実行
```

### デプロイ

```bash
# インフラのデプロイ
cd infrastructure/cdk-terraform
terraform init
terraform plan
terraform apply
```

<p align="right">(<a href="#readme-top">トップに戻る</a>)</p>

## ライセンス

このプロジェクトは [Unlicense License](LICENSE) の下で公開されています。

<p align="right">(<a href="#readme-top">トップに戻る</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/your-username/english-card-battle.svg?style=for-the-badge
[contributors-url]: https://github.com/your-username/english-card-battle/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/your-username/english-card-battle.svg?style=for-the-badge
[forks-url]: https://github.com/your-username/english-card-battle/network/members
[stars-shield]: https://img.shields.io/github/stars/your-username/english-card-battle.svg?style=for-the-badge
[stars-url]: https://github.com/your-username/english-card-battle/stargazers
[issues-shield]: https://img.shields.io/github/issues/your-username/english-card-battle.svg?style=for-the-badge
[issues-url]: https://github.com/your-username/english-card-battle/issues
[license-shield]: https://img.shields.io/github/license/your-username/english-card-battle.svg?style=for-the-badge
[license-url]: https://github.com/your-username/english-card-battle/blob/main/LICENSE
