# GitHub Actions ワークフロー一覧

このドキュメントでは、プロジェクトで使用されているGitHub Actionsワークフローについて説明します。

## 📊 概要

monorepo構成への移行に伴い、ワークフローを最適化しました：
- **Turborepo統合**: 変更されたパッケージのみ自動検出して実行
- **関心の分離**: Lint/Build/Testを独立したワークフローに分割
- **依存関係自動解決**: shared-types変更時に依存アプリも自動実行

---

## 🔄 コアCI/CDワークフロー

### 1. Lint - `.github/workflows/lint.yml`

**目的**: ESLintと型チェック

**トリガー:**
- `apps/`, `packages/` 配下のファイル変更時
- `eslint.config.base.mjs`, `tsconfig.base.json` 変更時

**処理:**
- `pnpm lint` → Turborepoが変更されたパッケージのみ実行

**例:**
```bash
# adminのみ変更 → admin#lint のみ実行
# shared-types変更 → 全アプリのlint実行（依存関係のため）
```

---

### 2. Build - `.github/workflows/build.yml`

**目的**: TypeScriptビルドと型チェック

**トリガー:**
- `apps/`, `packages/` 配下のファイル変更時
- `tsconfig.base.json`, `turbo.json` 変更時

**処理:**
- `pnpm build` → Turborepoが変更されたパッケージのみビルド

**例:**
```bash
# webのみ変更 → shared-types#build, web#build のみ実行
# shared-types変更 → 全アプリビルド（依存関係のため）
```

---

### 3. Test - `.github/workflows/test.yml` ⭐ 重要

**目的**: ユニットテストと統合テスト

**ジョブ構成:**

#### 3-1. **Unit Tests（Turborepo管理）**
- **対象**: admin, web
- **実行**: `pnpm test`
- **特徴**: Turborepoが変更されたアプリのみテスト

#### 3-2. **API Server Integration Tests（Docker Compose）** ⭐
- **対象**: api-server
- **依存**: MongoDB, Redis（Docker Composeで起動）
- **差分検出**: `dorny/paths-filter`で`apps/api-server/**`変更時のみ実行
- **実行**: `docker compose run --rm api-server npm run test:coverage`

**重要ポイント:**
```yaml
# api-server変更時のみDocker Composeテスト実行
- apps/api-server/** 変更 → 統合テスト実行
- admin/web変更 → 統合テストスキップ（効率化）
```

**テスト実行フロー:**
```
1. paths-filterで変更ファイル検出
   ↓
2. api-server変更あり？
   ├─ YES → Docker Compose起動 → テスト実行 → クリーンアップ
   └─ NO  → スキップ（ログ出力）
```

---

## 🏗️ Infrastructureワークフロー

### CDK関連

#### 1. CDK Lint - `.github/workflows/cdk-lint.yml`
- **トリガー:** `infrastructure/cdk/**` 変更時
- **処理:** ESLint + TypeScript型チェック

#### 2. CDK Diff - `.github/workflows/cdk-diff.yml`
- **トリガー:** `infrastructure/cdk/**` 変更時 or 手動実行
- **処理:** AWSリソースの差分確認

#### 3. CDK Deploy - `.github/workflows/cdk-deploy.yml`
- **トリガー:** 手動実行のみ
- **処理:** ECS Fargate環境へデプロイ

#### 4. CDK Scan - `.github/workflows/cdk-scan.yml`
- **トリガー:** 手動実行のみ
- **処理:** cdk-nagによるセキュリティスキャン

### Terraform関連

#### 1. Terraform Lint - `.github/workflows/terraform-lint.yml`
- **トリガー:** `infrastructure/terraform/**` 変更時
- **処理:** terraform fmt, validate, tflint

#### 2. Terraform Apply - `.github/workflows/terraform-apply.yml`
- **トリガー:** 手動実行のみ
- **処理:** Terraformの適用

#### 3. Terraform Destroy - `.github/workflows/terraform-destroy.yml`
- **トリガー:** 手動実行のみ
- **処理:** Terraformリソースの削除

#### 4. Terraform Scan - `.github/workflows/terraform-scan.yml`
- **トリガー:** 手動実行のみ
- **処理:** tfsecによるセキュリティスキャン

---

## 🚀 デプロイワークフロー

### API Server Image Push - `.github/workflows/api-server-image-push.yml`

**トリガー:**
- `apps/api-server/**`, `packages/shared-types/**` 変更時
- main/developブランチへのpush

**処理:**
1. Dockerイメージビルド
2. ECRへプッシュ
3. 環境別タグ付け（dev-latest, prd-latest）

### API Server Deploy - `.github/workflows/api-server-deploy.yml`

**トリガー:**
- Image Push完了後（自動）
- 手動実行

**処理:**
1. ECSタスク定義更新
2. ECSサービス更新
3. デプロイ完了待機
4. ヘルスチェック

---

## 🛡️ セキュリティワークフロー

### Scan Secret - `.github/workflows/scan-secret.yml`
- **ツール:** Gitleaks
- **処理:** シークレット漏洩スキャン

### Scan Vulnerability - `.github/workflows/scan-vulnerability.yml`
- **ツール:** Trivy
- **処理:** 脆弱性スキャン

---

## 🤖 自動化ワークフロー

### Auto Label - `.github/workflows/auto-label.yml`
- **処理:** PR自動ラベル付け

### Auto Merge - `.github/workflows/auto-merge.yml`
- **処理:** Dependabot PR自動マージ

---

## 📋 ワークフロー一覧表

| ワークフロー | トリガー | Turborepo | 外部依存 | 備考 |
|------------|---------|-----------|---------|------|
| **Lint** | `apps/**`, `packages/**` | ✅ | - | ESLint + 型チェック |
| **Build** | `apps/**`, `packages/**` | ✅ | - | TypeScriptビルド |
| **Test (Unit)** | `apps/**`, `packages/**` | ✅ | - | admin/webの単体テスト |
| **Test (API)** | `apps/api-server/**` | ❌ | Docker Compose | MongoDB/Redis必要 |
| CDK Lint | `infrastructure/cdk/**` | ❌ | npm | Infrastructure |
| Terraform Lint | `infrastructure/terraform/**` | ❌ | Terraform | Infrastructure |
| API Image Push | `apps/api-server/**` | ❌ | Docker/ECR | デプロイ準備 |
| API Deploy | Image Push完了後 | ❌ | AWS ECS | 本番デプロイ |

---

## 🎯 最適化のポイント

### ✅ Before（統合CI）

```yaml
# 単一のci.ymlですべて実行
jobs:
  lint: ...
  build: ...
  test: ...  # ← api-serverの特殊性を扱いづらい
```

**問題点:**
- ❌ api-serverの特殊なテスト要件（Docker Compose）を扱いにくい
- ❌ lintだけ実行したい場合も全ジョブがトリガー

### ✅ After（分割 + 条件分岐）

```yaml
# lint.yml
jobs:
  lint: ...

# build.yml
jobs:
  build: ...

# test.yml
jobs:
  unit-test: ...  # Turborepo管理
  api-server-integration-test:
    - paths-filterで差分検出
    - api-server変更時のみDocker Compose実行
```

**メリット:**
- ✅ 各ワークフローが独立して実行可能
- ✅ api-serverの特殊性を適切に処理
- ✅ 不要なDocker起動を回避（コスト削減）

---

## 💡 API Serverテスト戦略

### 差分検出の仕組み

```yaml
- uses: dorny/paths-filter@v2
  with:
    filters: |
      api-server:
        - 'apps/api-server/**'
        - 'packages/shared-types/**'
```

### 実行フロー例

```bash
# ケース1: api-serverファイル変更
$ git diff HEAD~1
apps/api-server/src/controller/user.ts

→ paths-filter: api-server=true
→ Docker Compose起動
→ MongoDB/Redis起動
→ 統合テスト実行
→ クリーンアップ

# ケース2: adminファイル変更
$ git diff HEAD~1
apps/admin/components/Header.tsx

→ paths-filter: api-server=false
→ Docker起動スキップ（効率化！）
→ "API Server files not changed" ログ出力
```

---

## 🔍 トラブルシューティング

### Q: shared-typesを変更したのにCIが走らない
A: `lint.yml`, `build.yml`, `test.yml`のpathsに`packages/**`が含まれているか確認

### Q: api-serverのテストだけ実行したい
A: ローカルで以下を実行：
```bash
cd apps/api-server
docker compose run --rm api-server npm run test
```

### Q: Turborepoのキャッシュをクリアしたい
A: `pnpm turbo run build --force`で強制再実行

### Q: Docker Composeテストがタイムアウトする
A: `test.yml`の`timeout-minutes`を調整、またはテストを高速化

---

## 📚 関連ドキュメント

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [dorny/paths-filter](https://github.com/dorny/paths-filter) - 差分検出アクション
- [GitHub Actions - Path Filters](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)
