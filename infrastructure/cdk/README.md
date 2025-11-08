# English Card Battle - CDK Infrastructure

このディレクトリには、English Card Battleのインフラストラクチャを定義するCDKコードが含まれています。

## 1️⃣ コマンド
適宜環境ごとにdev・stg・prdを切り替えて実行してください。

ローカルで実行する場合は、`aws configure`コマンドで事前に認証する必要があります。
オーナーからシークレットの情報をもらって設定してから実行してください。

#### デプロイ実行

```bash
# 一括デプロイ
npm run deploy:dev:execute
# 個別スタックをデプロイしたい場合
npm run deploy:dev:execute -- <Stack名>

# 一括デプロイ（スタックの作成まで）
npm run deploy:dev:no-execute
# 個別スタックをデプロイしたい場合（スタックの作成まで）
npm run deploy:dev:no-execute -- <Stack名>
```

####  差分確認
```bash
# 差分確認（裏側でsynsh）
npm run diff:dev
```

#### インフラ削除
```bash
# インフラ削除
npm run destroy:dev
```

#### スタック一覧
```bash
# スタック一覧取得
npm run list:dev
```

## 2️⃣ テスト方法
以下の２つのテストを導入しています。
1. スナップショットテスト
2. ポリシー検証テスト

#### テスト実行
リファクタリングの際に使用してください。
```bash
# テスト実行
npm test

# スナップショット更新
npm run test:updateSnapshot
```

#### ポリシー検証検証
cdk-nagを利用してポリシー検証を実行できます。
```bash
npm run nag-check:dev
```
