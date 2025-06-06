# Infrastructure Testing for English Card Battle

## 概要

English Card BattleのAWSインフラストラクチャーテストスイートです。実際のAWSリソースを作成せずに、Terraformプランの検証を中心としたテストを実施します。

## 🛠️ **技術スタック**

| 技術 | バージョン | 用途 |
|------|-----------|------|
| **Go** | 1.22.0 | テスト実装言語 |
| **Terratest** | 0.48.2 | Terraformテストフレームワーク |
| **Testify** | 1.10.0 | アサーションライブラリ |
| **AWS SDK Go v2** | 1.32.5 | AWS API検証 |

## 📁 **ディレクトリ構造**

```
test/
├── README.md               # このファイル
├── test.go                # 基本的なVPCテスト（レガシー）
├── unit/                  # ユニットテスト
│   ├── go.mod/go.sum      # Go依存関係管理
│   ├── vpc_test.go        # VPCモジュール
│   ├── alb_test.go        # ALBモジュール
│   └── ecs_test.go        # ECSモジュール
├── integration/           # インテグレーションテスト
│   ├── go.mod             # Go依存関係
│   └── dev_environment_test.go  # dev環境統合テスト
└── e2e/                   # エンドツーエンドテスト（準備中）
```

## 🧪 **テストレベル**

### **ユニットテスト (unit/)**
個別Terraformモジュールの動作検証
- **VPC**: ネットワーク構成とセキュリティグループ
- **ALB**: ロードバランサーとターゲットグループ  
- **ECS**: コンテナクラスターとタスク定義

### **インテグレーションテスト (integration/)**
モジュール間連携とdev環境全体の動作検証
- VPC + ALB + ECS の統合テスト
- 設定ファイルの構文チェック
- プランの実行検証

## 🚀 **実行方法**

### **前提条件**
```bash
# Go環境とAWS認証情報の設定
go version  # 1.22.0以上
aws configure
export AWS_DEFAULT_REGION="ap-northeast-1"
terraform version  # 1.0以上
```

### **ユニットテスト実行**
```bash
cd unit/
go mod download
go test -v -parallel 4
```

### **インテグレーションテスト実行**
```bash
cd integration/
go mod download
go test -v
```

## ⚠️ **重要事項**

- **プランベーステスト**: 実際のリソース作成は行わず、Terraformプランで検証
- **並列実行**: `t.Parallel()`でテスト効率化
- **構文チェック**: `terraform validate`による設定ファイルの検証
- **最小権限**: AWS認証情報は環境変数で管理 
