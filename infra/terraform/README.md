# English Card Battle - Terraform Infrastructure

## 概要

English Card BattleのTerraformインフラストラクチャです。

## 🚀 **クイックスタート**

### 必要なツールをインストール
```bash
# 必要なツールのインストール
brew install terraform
brew install tfsec
python3 -m pip install checkov
```
### aws認証
管理者からsecret情報をもらい、aws認証情報を設定してください。
```bash
# AWS認証情報の設定
aws configure
export AWS_DEFAULT_REGION="ap-northeast-1"
```
### terraform初期化
ローカルに.terraformディレクトリが作成されます。
```bash
cd env/dev
terraform init
```

## 💪 実行コマンド

### 差分検知
```bash
cd env/dev/
terraform plan
```
### デプロイ
```bash
cd env/dev
terraform apply
```
### 削除
```bash
cd env/dev
terraform destroy
```

## ✅ 開発コマンド
### フォーマット整形
```bash
cd env/dev
terraform fmt -check -recursive -diff
```
### バリデーションチェック
```bash
cd env/dev
terraform validate
```
### lint
Checkovを利用したlintチェック。
```bash
# PATHに追加（初回のみ）
export PATH="$HOME/Library/Python/3.9/bin:$PATH"

# lint実行
checkov -d . --framework terraform
```

```bash
# ヘルプの表示
make help

# dev環境の初期化と実行計画
make dev

# 全テストの実行
make test-all

# dev環境のデプロイ
make apply-dev
```

## 🛠️ **Makefileコマンド**

### **環境操作**

```bash
# 初期化
make init [ENVIRONMENT=dev]

# 実行計画
make plan [ENVIRONMENT=dev]
make plan-dev
make plan-stg
make plan-prd

# 適用
make apply [ENVIRONMENT=dev]
make apply-dev
make apply-stg
make apply-prd

# 削除
make destroy [ENVIRONMENT=dev]
make destroy-dev
make destroy-stg
make destroy-prd
```

### **テスト・バリデーション**

```bash
# 構文チェック
make validate

# 静的解析
make lint

# セキュリティ・コンプライアンスチェック
make security-test

# スナップショットテスト
make snapshot-test [ENVIRONMENT=dev]

# ユニットテスト
make unit-test

# インテグレーションテスト
make integration-test

# 全テスト実行
make test-all
```

### **ユーティリティ**

```bash
# ファイルフォーマット
make format

# クリーンアップ
make clean

# CI/CD用
make ci-validate
make ci-test
make ci-deploy
```

## 🧪 **テスト戦略**

### **多層防御アプローチ**

1. **静的解析層**
   - `terraform validate`: 構文チェック
   - `tflint`: 高度な静的解析
   - `tfsec`/`checkov`: セキュリティスキャン

2. **スナップショット層**
   - Terraform plan出力のスナップショット
   - 設定変更の検出

3. **実際のリソース層**
   - Terratest（ユニット・統合）
   - エンドツーエンドテスト

4. **セキュリティ・コンプライアンス層**
   - セキュリティスキャナー
   - コスト監視

### **テストの実行順序**

```bash
# 1. 静的解析
make validate
make lint

# 2. セキュリティチェック
make security-test

# 3. スナップショットテスト
make snapshot-test ENVIRONMENT=dev

# 4. 実際のリソーステスト
make unit-test
make integration-test

# 5. 全テスト実行
make test-all
```

## 🔒 **セキュリティ・コンプライアンス**

### **セキュリティチェック**

```bash
# tfsecによるセキュリティスキャン
tfsec aws/env/dev/

# checkovによるコンプライアンスチェック
checkov -d aws/env/dev/ --framework terraform
```

### **主要なセキュリティルール**

- **VPC**: 適切なCIDRブロック、セキュリティグループ
- **ALB**: HTTPS強制、適切なセキュリティグループ
- **ECS**: タスク定義のセキュリティ、IAMロール
- **ECR**: イメージスキャン、ライフサイクルポリシー

## 📊 **コスト最適化**

### **コスト監視**

```bash
# infracostによるコスト見積もり
infracost breakdown --path aws/env/dev/

# コスト差分の確認
infracost diff --path aws/env/dev/
```

### **コスト最適化のポイント**

- **ECS**: 適切なCPU/メモリ設定
- **ALB**: 使用していないターゲットグループの削除
- **ECR**: 不要なイメージの削除
- **NAT Gateway**: 使用していない場合は削除

## 🔄 **CI/CD統合**

### **GitHub Actions例**

```yaml
name: Terraform Infrastructure

on:
  push:
    branches: [main]
    paths: ['infra/terraform/**']
  pull_request:
    branches: [main]
    paths: ['infra/terraform/**']

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
      - name: Validate and Test
        run: |
          cd infra/terraform
          make ci-validate
          make ci-test

  deploy:
    needs: validate
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
      - name: Deploy
        run: |
          cd infra/terraform
          make ci-deploy
```

## 🚨 **トラブルシューティング**

### **よくある問題**

#### **1. 初期化エラー**

```bash
# Terraformの初期化を確認
make init ENVIRONMENT=dev

# プロバイダーの更新
terraform init -upgrade
```

#### **2. プランエラー**

```bash
# 構文チェック
make validate

# 静的解析
make lint

# 詳細なエラー確認
terraform plan -detailed-exitcode
```

#### **3. 適用エラー**

```bash
# 状態ファイルの確認
terraform state list

# 特定リソースの確認
terraform state show aws_vpc.main
```

#### **4. テストエラー**

```bash
# テストの詳細実行
cd aws/test/unit && go test -v

# テスト用リソースのクリーンアップ
make clean
```

## 📚 **参考資料**

- [Terraform公式ドキュメント](https://www.terraform.io/docs)
- [TFLint公式ドキュメント](https://github.com/terraform-linters/tflint)
- [tfsec公式ドキュメント](https://aquasecurity.github.io/tfsec/)
- [Checkov公式ドキュメント](https://www.checkov.io/)
- [Terratest公式ドキュメント](https://terratest.gruntwork.io/)

## 🤝 **貢献**

1. 機能追加時は必ずテストを追加
2. セキュリティチェックを通過してからマージ
3. コスト影響を確認してからデプロイ
4. ドキュメントを更新

## 📄 **ライセンス**

このプロジェクトはMITライセンスの下で公開されています。 
