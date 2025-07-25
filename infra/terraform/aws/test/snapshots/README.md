# Terraform Snapshot Tests

## 概要

Terraformのスナップショットテストは、インフラストラクチャの設定変更を検出し、意図しない変更を防ぐためのテストです。CDKのスナップショットテストと同等の機能を提供します。

## 目的

1. **設定変更の検出**: Terraform planの出力をスナップショットとして保存し、変更を検出
2. **回帰テスト**: 既存の設定が意図せず変更されていないことを確認
3. **ドキュメント化**: インフラの現在の状態を記録
4. **レビュー支援**: 変更内容の可視化

## 使用方法

### スナップショットの作成

```bash
# dev環境のスナップショットを作成
make snapshot-test ENVIRONMENT=dev

# stg環境のスナップショットを作成
make snapshot-test ENVIRONMENT=stg

# prd環境のスナップショットを作成
make snapshot-test ENVIRONMENT=prd
```

### スナップショットの比較

```bash
# 前回のスナップショットと比較
diff aws/test/snapshots/dev-snapshot.json aws/test/snapshots/dev-snapshot-previous.json

# 環境間の比較
diff aws/test/snapshots/dev-snapshot.json aws/test/snapshots/stg-snapshot.json
```

### スナップショットの管理

```bash
# 古いスナップショットをバックアップ
cp aws/test/snapshots/dev-snapshot.json aws/test/snapshots/dev-snapshot-$(date +%Y%m%d).json

# スナップショットの履歴を確認
ls -la aws/test/snapshots/
```

## ファイル構造

```
aws/test/snapshots/
├── README.md                    # このファイル
├── dev-snapshot.json           # dev環境のスナップショット
├── stg-snapshot.json           # stg環境のスナップショット
├── prd-snapshot.json           # prd環境のスナップショット
└── dev-snapshot-20241201.json # 履歴スナップショット（例）
```

## スナップショットの内容

スナップショットファイルには以下の情報が含まれます：

- **リソースの作成・更新・削除計画**
- **リソースの属性値**
- **依存関係**
- **設定パラメータ**

## CI/CD統合

### GitHub Actionsでの自動実行

```yaml
- name: Run Snapshot Tests
  run: |
    make snapshot-test ENVIRONMENT=dev
    make snapshot-test ENVIRONMENT=stg
    # prd環境は手動実行のみ
```

### 変更検出時の通知

```yaml
- name: Check for Snapshot Changes
  run: |
    if [ -f aws/test/snapshots/dev-snapshot.json ]; then
      if ! git diff --quiet aws/test/snapshots/dev-snapshot.json; then
        echo "⚠️ Snapshot changes detected for dev environment"
        exit 1
      fi
    fi
```

## ベストプラクティス

1. **定期的なスナップショット作成**: デプロイ前に必ずスナップショットを作成
2. **変更のレビュー**: スナップショットの変更は必ずレビュー
3. **履歴の保持**: 重要な変更前のスナップショットは履歴として保持
4. **環境別管理**: 各環境のスナップショットは独立して管理

## トラブルシューティング

### スナップショットが作成されない

```bash
# Terraformの初期化を確認
make init ENVIRONMENT=dev

# 設定ファイルの構文チェック
make validate ENVIRONMENT=dev
```

### スナップショットの差分が大きすぎる

```bash
# 設定ファイルの変更履歴を確認
git log --oneline aws/env/dev/

# 特定のリソースの変更を確認
terraform plan -target=aws_vpc.main
```

### スナップショットファイルが大きすぎる

```bash
# 不要な情報を除外してスナップショットを作成
terraform plan -out=plan.out
terraform show -json plan.out | jq 'del(.resource_changes[].change.before)' > snapshot.json
```

## 関連コマンド

- `make validate`: Terraform構文チェック
- `make lint`: TFLintによる静的解析
- `make security-test`: セキュリティ・コンプライアンスチェック
- `make test-all`: 全テスト実行 
