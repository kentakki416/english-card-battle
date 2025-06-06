# 🚀 GitHub Actions Workflows for Infrastructure Management

このディレクトリには、Terraformベースのインフラストラクチャを管理するためのGitHub Actionsワークフローが含まれています。

## 📋 ワークフロー概要

### 🏗️ terraform-test.yml - 統合CI パイプライン
**自動実行**: `infra/`ディレクトリの変更時に自動実行

```yaml
トリガー:
- push (main, develop ブランチ)
- pull_request (main, develop ブランチ)
- infra/** の変更
- workflow_dispatch (手動実行)
```

**包括的な機能:**
- 🔍 変更検出 (スマートフィルタリング)
- 🧹 Terraform Lint & Validation + TFLint
- 🔒 セキュリティスキャン (tfsec, Checkov, SARIF)
- 🧪 Goテスト (Unit/Integration)
- 📋 Terraform プラン生成・分析
- 📊 ステート管理チェック
- 💬 PR自動コメント機能

### 🚀 terraform-apply.yml - デプロイ専用
**手動実行のみ**: `workflow_dispatch`による手動実行

```yaml
必須入力:
- environment: dev/prd
- confirm_apply: "APPLY" と入力
- dry_run: true (デフォルト、プランのみ)
```

**安全機能:**
- ✅ 二重確認機能
- 🔍 事前バリデーション
- 📋 フレッシュプラン生成
- 🔍 安全性チェック
- 📊 適用後検証

### 💥 terraform-destroy.yml - 削除専用
**手動実行のみ**: `workflow_dispatch`による手動実行

```yaml
必須入力:
- environment: dev/prd
- confirm_destroy: "DESTROY" と入力
- additional_confirmation: 環境名を再入力
- dry_run: true (デフォルト、プランのみ)
```

**超安全機能:**
- ⚠️ 三重確認機能
- 🔍 リソース数カウント
- 🚨 重要リソース警告
- ⏰ 実行前待機時間
- 📊 削除後検証



### 🔍 dependency-check.yml - セキュリティ監査
**定期実行**: 毎週月曜日 + 手動実行

```yaml
スケジュール:
- 毎週月曜日 09:00 (JST)
- workflow_dispatch
```

**監査機能:**
- 🔒 Go依存関係セキュリティスキャン
- 📊 Terraformバージョン一貫性チェック
- 💰 インフラコスト見積もり
- 📈 SARIFセキュリティレポート

## 🔧 必要な設定

### GitHub Secrets
以下のシークレットを設定してください：

```yaml
AWS_ACCESS_KEY_ID: AWS アクセスキー
AWS_SECRET_ACCESS_KEY: AWS シークレットキー
INFRACOST_API_KEY: Infracost API キー (オプション)
```

### GitHub Environments
本番環境の保護のため、以下の環境を設定することを推奨：

```yaml
environments:
- dev: 開発環境 (制限なし)
- prd: 本番環境 (承認必須)
- dev-destroy: 開発削除 (制限なし)
- prd-destroy: 本番削除 (複数承認必須)
```

## 📊 ワークフロー実行順序

### 🔄 通常の開発フロー

1. **開発作業**
   ```bash
   # infra/ 配下でTerraform変更
   git add infra/
   git commit -m "feat: update infrastructure"
   git push origin feature/update-infra
   ```

2. **PR作成時**
   - `terraform-test.yml` (統合CI) が自動実行
   - PRに結果コメントが自動投稿される

3. **PR承認・マージ後**
   - `terraform-test.yml` (統合CI) が再度実行
   - プランが生成・保存される

4. **本番デプロイ**
   ```yaml
   # GitHub UI から手動実行
   terraform-apply.yml:
     environment: prd
     confirm_apply: "APPLY"
     dry_run: false
   ```

### 🚨 緊急削除フロー

1. **削除プラン確認**
   ```yaml
   terraform-destroy.yml:
     environment: dev
     confirm_destroy: "DESTROY"
     additional_confirmation: "dev"
     dry_run: true  # プランのみ
   ```

2. **実際の削除実行**
   ```yaml
   terraform-destroy.yml:
     environment: dev
     confirm_destroy: "DESTROY"
     additional_confirmation: "dev"
     dry_run: false  # 実際に削除
   ```

## 🛡️ セキュリティ機能

### CI段階のセキュリティ
- **tfsec**: リソース設定の脆弱性スキャン
- **Checkov**: 設定ベストプラクティスチェック
- **TFLint**: Terraform構文・スタイルチェック
- **Gosec**: Goコードセキュリティスキャン

### Deploy段階のセキュリティ
- **二重確認**: Apply時に"APPLY"入力必須
- **環境保護**: GitHubEnvironments連携
- **プラン検証**: 危険な操作の事前検出
- **タイムスタンプ**: 実行履歴の記録

### Destroy段階のセキュリティ
- **三重確認**: "DESTROY" + 環境名入力必須
- **重要リソース警告**: DB、S3等の警告表示
- **実行前待機**: 10秒間の最終確認時間
- **段階的実行**: Plan → Apply の明確な分離

## 📈 監視とレポート

### 実行結果の確認方法

1. **GitHub Actions タブ**
   - ワークフロー実行履歴
   - ジョブ別実行状況
   - エラーログとスタックトレース

2. **PR コメント**
   - テスト結果の自動投稿
   - プラン差分の表示
   - セキュリティスキャン結果

3. **Step Summary**
   - 実行サマリーの表示
   - リソース数の記録
   - 次のアクションの提案

### アーティファクト管理

```yaml
保存期間:
- terraform-plan-*: 5日間
- terraform-apply-plan-*: 1日間
- terraform-destroy-plan-*: 1日間
- security-reports: 30日間
```

## 🚀 パフォーマンス最適化

### 並列実行戦略
- **Matrix Strategy**: 複数環境の同時処理
- **Job Dependencies**: 必要最小限の依存関係
- **Artifact Cache**: Terraform初期化の高速化

### コスト最適化
- **Change Detection**: 変更があった場合のみ実行
- **Conditional Jobs**: 条件付きジョブ実行
- **Resource Cleanup**: 不要なアーティファクトの自動削除

## 🛠️ トラブルシューティング

### よくある問題と解決法

1. **認証エラー**
   ```yaml
   原因: AWS認証情報の期限切れ
   解決: GitHub Secretsを更新
   ```

2. **ステートロック**
   ```yaml
   原因: 並行実行によるロック競合
   解決: 手動でのロック解除が必要
   ```

3. **プラン差分なし**
   ```yaml
   原因: 実際の変更がない
   確認: terraform plan の詳細を確認
   ```

### 緊急時の対応

1. **ワークフロー停止**
   ```bash
   GitHub UI -> Actions -> 実行中のワークフロー -> Cancel
   ```

2. **強制実行**
   ```bash
   # ローカルで直接実行
   cd infra/aws/env/dev
   terraform init
   terraform plan
   terraform apply
   ```

## 📚 参考リンク

- [Terraform GitHub Actions](https://github.com/hashicorp/setup-terraform)
- [AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terratest Documentation](https://terratest.gruntwork.io/)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)

## 🎯 ベストプラクティス

### 開発時
- ✅ ローカルでのテスト実行を習慣化
- ✅ 小さな変更単位でのコミット
- ✅ 適切なコミットメッセージの記述

### レビュー時
- ✅ プラン結果の詳細確認
- ✅ セキュリティスキャン結果のチェック
- ✅ テスト結果の検証

### デプロイ時
- ✅ 事前のドライラン実行
- ✅ 本番環境での段階的適用
- ✅ デプロイ後の動作確認 
