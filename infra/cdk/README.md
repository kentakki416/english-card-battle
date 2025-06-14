# English Card Battle - CDK Infrastructure

このディレクトリには、English Card Battleのインフラストラクチャを定義するCDKコードが含まれています。

## ディレクトリ構造

```
cdk/
├── bin/                    # CDKアプリケーションのエントリーポイント
│   └── english-card-battle-cdk.ts  # スタックのインスタンス化と設定
├── lib/                    # スタックの定義
│   └── dev-stack.ts        # 開発環境のインフラストラクチャ定義
├── package.json           # プロジェクトの依存関係とスクリプト
├── tsconfig.json          # TypeScriptの設定
├── cdk.json              # CDKの設定ファイル
├── .gitignore            # Gitの除外設定
└── README.md             # このファイル
```

### 各ディレクトリの説明

- `bin/`: CDKアプリケーションのエントリーポイントを含むディレクトリ
  - `english-card-battle-cdk.ts`: スタックのインスタンス化と環境設定を行うファイル

- `lib/`: インフラストラクチャの定義を含むディレクトリ
  - `dev-stack.ts`: 開発環境のVPC、ECR、ECS、ALBなどのリソースを定義するファイル

## 前提条件

- Node.js (v14以上)
- AWS CLI
- AWS CDK CLI

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. AWS認証情報の設定:
```bash
aws configure --profile dev
```

## 使用方法

### 開発環境のデプロイ

1. CDKの初期化（初回のみ）:
```bash
npm run bootstrap --profile dev
```

2. インフラのデプロイ:
```bash
npm run deploy:dev
```

3. インフラの削除:
```bash
npm run destroy:dev
```

### 差分確認と検証

#### 差分の確認方法

1. 変更内容の確認（デプロイせず）:
```bash
npm run diff:dev
```

2. CloudFormationにスタックを追加（デプロイせず）:
```bash
npm run deploy:dev:no-execute
```

### その他のコマンド

- スタックの一覧表示:
```bash
npm run list:dev
```

## インフラストラクチャの構成

このCDKプロジェクトは以下のAWSリソースを作成します：

- VPC
  - パブリックサブネット（2つのAZ）
  - プライベートサブネット（2つのAZ）
  - NAT Gateway
  - Internet Gateway

- ECR
  - コンテナイメージリポジトリ
  - ライフサイクルポリシー

- ECS
  - Fargateクラスター
  - タスク定義
  - サービス

- ALB
  - パブリックALB
  - ターゲットグループ
  - ヘルスチェック

## 注意事項

- 開発環境用の設定となっています
- 本番環境用の設定は別途作成が必要です
- セキュリティグループの設定は必要に応じて調整してください
- `cdk.json`にベストプラクティスに基づく設定が含まれています
- 差分確認時は必ず`--no-fail`オプションを使用して、デプロイを防止してください
- `--no-execute`オプションを使用することで、CloudFormationにスタックを追加するだけで、実際のデプロイは行いません
