# CDKからCDK-Terraformへの移行ガイド

## 📋 移行概要

このガイドでは、既存のCDKでデプロイされたVPC、Route53、ApiServerスタックをCDK-Terraformに移行する手順を説明します。

### 移行要件
- ✅ リソースの再作成は認められない
- ✅ 最もシンプルなimport方法を採用
- ✅ 将来的にはスタックを削除予定

## 🔄 Terraform Import方法の比較と推奨

### terraform importコマンド vs importブロック

#### terraform importコマンド
**利点:**
- ✅ シンプルで直感的な操作
- ✅ 既存のTerraformワークフローに統合しやすい
- ✅ 段階的なimportが可能
- ✅ エラーハンドリングが明確
- ✅ 設定生成機能（`terraform plan -generate-config-out`）との相性が良い

**欠点:**
- ❌ 手動でリソースIDを指定する必要がある
- ❌ 複数リソースのimportが面倒
- ❌ 設定生成後にimportブロックを削除する手間

#### importブロック（Terraform 1.5以降）
**利点:**
- ✅ 宣言的なimport設定
- ✅ 設定ファイルにimport情報が残る
- ✅ 複数リソースの一括importが可能
- ✅ 設定生成との統合が優れている

**欠点:**
- ❌ 比較的新しい機能（Terraform 1.5以降）
- ❌ 学習コストが若干高い
- ❌ 複雑なリソースの依存関係で制限がある場合がある

### 推奨アプローチ

**このプロジェクトでは`terraform import`コマンドを推奨します。**

**推奨理由:**
1. **段階的移行の適合性**: CDKからCDK-Terraformへの段階的移行に最適
2. **エラーハンドリング**: 各リソースのimport結果を個別に確認可能
3. **既存ワークフロー**: 現在のプロジェクト構成との親和性が高い
4. **設定生成との組み合わせ**: `terraform plan -generate-config-out`との相性が良い
5. **リソースの再作成不可**: 慎重な移行が必要な要件に適合

## 🏗️ 移行アーキテクチャ

### 既存CDKスタック構成
```
CDK Stacks:
├── VpcStack (common/vpc-stack.ts)
├── Route53Stack (common/route53-stack.ts)
└── ApiServerStack (api-server-stack.ts)
```

### 移行後のCDK-Terraform構成
```
CDK-Terraform:
├── MainStack (main.ts)
│   ├── VpcConstruct
│   ├── Route53Construct
│   └── ApiServerConstruct
└── 段階的import実行
```


## 📝 詳細な実行手順

### 1. 既存リソースの確認

```bash
# 既存のCDKリソースを確認
aws ec2 describe-vpcs --filters "Name=tag:Project,Values=english-card-battle"
aws route53 list-hosted-zones
aws ecs list-clusters
aws ecr describe-repositories
```

### 2. CDK-Terraformコードの準備

#### パラメータファイル (parameters/index.ts)
```typescript
export type Environment = 'dev' | 'stg' | 'prd';

export interface EnvironmentParameters {
  vpc: {
    vpcCidr: string;
    maxAzs: number;
    natGateways: number;
    subnetConfiguration: Array<{
      cidrMask: number;
      name: string;
      subnetType: string;
    }>;
  };
  ecs: {
    cpu: number;
    memoryLimitMiB: number;
    containerPort: number;
    hostPort: number;
    desiredCount: number;
    maxHealthyPercent: number;
    minHealthyPercent: number;
    enableExecuteCommand: boolean;
  };
  ecr: {
    repositoryName: string;
  };
}

export function getEnvironmentParameters(environment: Environment): EnvironmentParameters {
  // 既存CDKのパラメータを参考に実装
}
```

#### VPCスタック (stacks/common/vpc-stack.ts)
```typescript
import { Construct } from "constructs";
import { TerraformOutput } from "cdktf";
import { Vpc } from "../../.gen/providers/aws/vpc";
import { Subnet } from "../../.gen/providers/aws/subnet";
// ... 他のimport

export class VpcStack extends Construct {
  public readonly vpc: Vpc;
  public readonly publicSubnets: Subnet[];
  public readonly privateSubnets: Subnet[];

  constructor(scope: Construct, id: string, props: VpcStackProps) {
    super(scope, id);
    // 既存CDKのVPCスタックを参考に実装
  }
}
```

### 3. Import実行手順（推奨: terraform importコマンド）

#### VPCリソースのimport
```bash
# 1. 基本的なVPCスタックコードを作成
# 2. terraform importを実行（推奨方法）
terraform import aws_vpc.main vpc-xxxxxxxxx

# 3. 設定生成で完全な設定を取得
terraform plan -generate-config-out=vpc-generated.tf

# 4. 生成された設定を統合してresourceブロックを完成
# 5. 動作確認
terraform plan
```

#### Route53リソースのimport
```bash
# 1. 基本的なRoute53スタックコードを作成
# 2. terraform importを実行（推奨方法）
terraform import aws_route53_zone.main Z1234567890ABC

# 3. 設定生成で完全な設定を取得
terraform plan -generate-config-out=route53-generated.tf

# 4. 生成された設定を統合してresourceブロックを完成
# 5. 動作確認
terraform plan
```

#### ApiServerリソースのimport
```bash
# 1. 基本的なApiServerスタックコードを作成
# 2. 各リソースを順次import（推奨方法）
terraform import aws_ecr_repository.main english-card-battle-api-dev
terraform import aws_ecs_cluster.main english-card-battle-cluster
# ... 他のリソース

# 3. 設定生成で完全な設定を取得
terraform plan -generate-config-out=apiserver-generated.tf

# 4. 生成された設定を統合してresourceブロックを完成
# 5. 動作確認
terraform plan
```

#### 代替案: importブロック（参考）
```hcl
# 設定ファイルにimportブロックを追加（Terraform 1.5以降）
import {
  to = aws_vpc.main
  id = "vpc-xxxxxxxxx"
}

import {
  to = aws_route53_zone.main
  id = "Z1234567890ABC"
}
```

### 4. 動作確認

```bash
# 差分確認
cdktf diff

# デプロイテスト
cdktf deploy

# 出力値の確認
cdktf output
```

### 5. CDKスタックの段階的削除

```bash
# 1. ApiServerスタックを削除
cd infra/cdk
cdk destroy api-server-stack

# 2. Route53スタックを削除
cdk destroy route53-stack

# 3. VPCスタックを削除
cdk destroy vpc-stack
```

## ⚠️ 注意事項

### Import方法の選択
- **推奨**: `terraform import`コマンドを使用
- **理由**: 段階的移行、エラーハンドリング、設定生成との相性が優れている
- **代替**: importブロック（Terraform 1.5以降）も検討可能

### リソースの依存関係
- ApiServerスタックはVPCスタックに依存
- Route53スタックは独立しているが、ApiServerで使用される可能性
- 削除順序: ApiServer → Route53 → VPC

### 設定値の一致
- import前に既存リソースの設定値を確認
- resourceブロックの値は既存リソースと完全に一致する必要
- 設定生成機能（`terraform plan -generate-config-out`）を活用して設定値の漏れを防ぐ

### 段階的移行の重要性
- 一度に全てのリソースを移行しない
- 各段階で動作確認を実施
- 問題が発生した場合のロールバック手順を準備

### terraform importコマンドのベストプラクティス
- 各リソースのimport後に`terraform plan`で動作確認
- 設定生成後は必ず生成された設定を確認してから統合
- 複雑なリソースは依存関係を考慮して順序を決定

## 🔄 ロールバック手順

### CDK-TerraformからCDKに戻す場合
```bash
# 1. CDK-Terraformのリソースを削除
cdktf destroy

# 2. CDKで再デプロイ
cd infra/cdk
cdk deploy
```

### 特定のスタックのみロールバック
```bash
# 該当するスタックのみを削除してCDKで再デプロイ
```

## 📚 参考資料

- [Terraform Import Documentation](https://developer.hashicorp.com/terraform/cli/import)
- [CDK for Terraform Documentation](https://developer.hashicorp.com/terraform/cdktf)
- [AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
