# Terraform Remote State Bootstrap

このディレクトリには、Terraformのremote stateを設定するためのリソース（S3バケットとDynamoDBテーブル）を作成するコードが含まれています。

## 概要

- **S3バケット**: Terraformのstateファイルを保存
- **DynamoDBテーブル**: Terraformのstate lockingを提供

## 使用方法

### 1. Terraformの実行

```bash
# 初期化
terraform init

# プランの確認
terraform plan

# リソースの作成
terraform apply
```

### 2. 他のプロジェクトでの使用

作成されたリソースを他のTerraformプロジェクトで使用するには、以下のようにbackend設定を行います：

```hcl
terraform {
  backend "s3" {
    bucket         = "作成されたバケット名"
    key            = "環境名/terraform.tfstate"
    region         = "ap-northeast-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}
```

## セキュリティ機能

- S3バケットの暗号化（AES256）
- S3バケットのバージョニング有効化
- S3バケットのパブリックアクセスブロック
- DynamoDBテーブルの暗号化
- DynamoDBテーブルのpoint-in-time recovery

## 注意事項

- このbootstrapは一度だけ実行してください
- 作成されたリソースは他のTerraformプロジェクトで使用されるため、削除しないでください
