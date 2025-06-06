# Remote backend configuration
# Bootstrapで作成されたS3バケットとDynamoDBテーブルを使用

terraform {
  backend "s3" {
    bucket         = "english-card-battle-terraform-state"
    key            = "dev/terraform.tfstate" # バケット内のパス
    region         = "ap-northeast-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true # データの暗号化
  }
}
