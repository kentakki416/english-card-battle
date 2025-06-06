# =============================================================================
# English Card Battle - Dev Environment
# =============================================================================

# 共通設定とローカル変数
locals {
  # 基本設定
  project_name = "english-card-battle"
  environment  = "dev"
  aws_region   = "ap-northeast-1"
  name_prefix  = "${local.project_name}-${local.environment}"

  # ネットワーク設定
  vpc_cidr = "10.0.0.0/16"

  # アプリケーション設定
  app_port        = 3000
  container_image = "nginx:latest" # TODO: 実際のアプリイメージに変更

  # ECS設定
  ecs_task_cpu      = "256" # 0.25 vCPU
  ecs_task_memory   = "512" # 512 MB
  ecs_desired_count = 1     # dev環境は1台で十分
}

# =============================================================================
# コンテナレジストリ設定 (ECR)
# =============================================================================

# ECRモジュール呼び出し
# - Dockerイメージの保存とバージョン管理
# - セキュリティスキャンとライフサイクル管理
module "ecr" {
  source = "../../modules/ecr"

  # === 基本設定 ===
  project_name = local.project_name # english-card-battle
  environment  = local.environment  # dev

  # === イメージ保持設定 ===
  image_retention_count         = 10 # 最新10個のイメージを保持
  untagged_image_retention_days = 1  # タグなしイメージは1日で削除
}

# =============================================================================
# ネットワーク設定 (VPC, サブネット, セキュリティグループ)
# =============================================================================

# VPCモジュール呼び出し
# - 開発環境用のプライベートネットワークを構築
# - パブリック/プライベートサブネットを2つのAZに分散配置
module "vpc" {
  source = "../../modules/vpc"

  # === 基本設定 ===
  name                    = "${local.name_prefix}-vpc"
  cidr_block              = local.vpc_cidr # 10.0.0.0/16 (65,536個のIPアドレス)
  enable_dns_support      = true           # Route53プライベートホストゾーン用
  enable_dns_hostnames    = true           # EC2インスタンスのDNS名自動割り当て
  create_internet_gateway = true           # インターネット接続用

  # === サブネット設定 ===
  # 高可用性のため2つのAZに分散配置
  subnets = {
    # --- パブリックサブネット (ALB配置用) ---
    # インターネットからの通信を受ける
    public-1 = {
      cidr_block        = "10.0.1.0/24" # 256個のIPアドレス (ap-northeast-1a)
      availability_zone = "ap-northeast-1a"
      subnet_type       = "public" # Internet Gateway経由でインターネット接続
    }
    public-2 = {
      cidr_block        = "10.0.2.0/24" # 256個のIPアドレス (ap-northeast-1c)
      availability_zone = "ap-northeast-1c"
      subnet_type       = "public"
    }

    # --- プライベートサブネット (ECS配置用) ---
    # セキュリティを重視し、直接インターネット接続なし
    private-1 = {
      cidr_block        = "10.0.11.0/24" # 256個のIPアドレス (ap-northeast-1a)
      availability_zone = "ap-northeast-1a"
      subnet_type       = "private" # NAT Gateway経由でアウトバウンド通信のみ
    }
    private-2 = {
      cidr_block        = "10.0.12.0/24" # 256個のIPアドレス (ap-northeast-1c)
      availability_zone = "ap-northeast-1c"
      subnet_type       = "private"
    }
  }

  # === ルートテーブル設定 ===
  # トラフィックの経路を制御
  route_tables = {}

  # === セキュリティグループ定義 ===
  security_groups = {
    # ECSタスク用セキュリティグループ
    ecs_sg = {
      name        = "${local.name_prefix}-ecs-sg"
      description = "Security group for ECS tasks - Allow access from ALB only"
    }
    # ALB用セキュリティグループ  
    alb_sg = {
      name        = "${local.name_prefix}-alb-sg"
      description = "Security group for ALB - Allow HTTP/HTTPS from internet"
    }
  }

  # === セキュリティグループルール ===
  # 最小権限の原則に基づく通信制御
  security_group_rules = [
    # --- ALB用ルール ---
    {
      security_group_name = "alb_sg"
      type                = "ingress"
      from_port           = 80
      to_port             = 80
      protocol            = "tcp"
      cidr_blocks         = ["0.0.0.0/0"] # 全インターネットからHTTP受信
      description         = "HTTP access from internet"
    },
    {
      security_group_name = "alb_sg"
      type                = "ingress"
      from_port           = 443
      to_port             = 443
      protocol            = "tcp"
      cidr_blocks         = ["0.0.0.0/0"] # 全インターネットからHTTPS受信
      description         = "HTTPS access from internet"
    },
    {
      security_group_name = "alb_sg"
      type                = "egress"
      from_port           = 0
      to_port             = 0
      protocol            = "-1"          # 全プロトコル
      cidr_blocks         = ["0.0.0.0/0"] # 全送信先へのアウトバウンド許可
      description         = "All outbound traffic"
    },

    # --- ECS用ルール ---
    {
      security_group_name        = "ecs_sg"
      type                       = "ingress"
      from_port                  = local.app_port # アプリケーションポート (3000)
      to_port                    = local.app_port
      protocol                   = "tcp"
      source_security_group_name = "alb_sg" # ALBからのみアクセス許可
      description                = "Application port from ALB only"
    },
    {
      security_group_name = "ecs_sg"
      type                = "egress"
      from_port           = 0
      to_port             = 0
      protocol            = "-1"
      cidr_blocks         = ["0.0.0.0/0"] # 外部API呼び出し等のため
      description         = "All outbound traffic for external API calls"
    }
  ]
}

# =============================================================================
# ロードバランサー設定 (Application Load Balancer)
# =============================================================================

# ALBモジュール呼び出し
# - インターネットからの通信を受けてECSに振り分け
# - SSL終端、ヘルスチェック、トラフィック分散を担当
module "alb" {
  source = "../../modules/alb"

  # === 基本設定 ===
  name            = "${local.name_prefix}-alb"
  vpc_id          = module.vpc.vpc_id                         # VPCモジュールで作成されたVPC
  security_groups = [module.vpc.security_groups["alb_sg"].id] # ALB用セキュリティグループ
  subnets = [
    module.vpc.subnets["public-1"].id, # パブリックサブネット1
    module.vpc.subnets["public-2"].id  # パブリックサブネット2
  ]

  # === ターゲットグループ設定 ===
  target_group_port = local.app_port # アプリケーションのリスニングポート (3000)
  listener_port     = "80"           # ALBのリスニングポート (HTTP)

  # === タグ設定 ===
  tags = {
    Name        = "${local.name_prefix}-alb"
    Component   = "LoadBalancer"
    Environment = local.environment
  }
}

# =============================================================================
# コンテナ実行環境設定 (ECS Fargate)
# =============================================================================

# ECSモジュール呼び出し
# - Fargateを使用したサーバーレスコンテナ実行環境
# - アプリケーションコンテナの実行とスケーリングを管理
module "ecs" {
  source = "../../modules/ecs"

  # === 基本設定 ===
  cluster_name           = "${local.name_prefix}-cluster"
  task_definition_family = "${local.name_prefix}-task"
  service_name           = "${local.name_prefix}-service"

  # === リソース設定 ===
  cpu    = local.ecs_task_cpu    # CPUユニット (256 = 0.25 vCPU)
  memory = local.ecs_task_memory # メモリ (512 MB)

  # === コンテナ設定 ===
  container_name  = "${local.name_prefix}-app" # コンテナ名
  container_image = local.container_image      # コンテナイメージ (nginx:latest)
  container_port  = local.app_port             # コンテナ内ポート (3000)

  # === ネットワーク設定 ===
  network_configuration = {
    subnets = [
      module.vpc.subnets["private-1"].id, # プライベートサブネット1
      module.vpc.subnets["private-2"].id  # プライベートサブネット2
    ]
    security_groups  = [module.vpc.security_groups["ecs_sg"].id] # ECS用セキュリティグループ
    assign_public_ip = false                                     # パブリックIP不要 (プライベートサブネット)
  }

  # === ロードバランサー連携 ===
  target_group_arn = module.alb.target_group_arn # ALBのターゲットグループ

  # === ログ設定 ===
  log_retention_in_days = 7 # dev環境なので短期保存

  # === タグ設定 ===
  tags = {
    Name        = "${local.name_prefix}-ecs"
    Component   = "Container"
    Environment = local.environment
  }
}

