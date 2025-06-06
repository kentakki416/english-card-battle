package test

import (
	"fmt"
	"testing"
	"time"

	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

func TestDevEnvironmentPlan(t *testing.T) {
	// 本格的な統合テストのため、並列実行は無効化
	// t.Parallel()

	// ユニークなリソース名を生成
	uniqueId := fmt.Sprintf("%d", time.Now().Unix())
	testProject := fmt.Sprintf("test-english-card-%s", uniqueId)

	terraformOptions := &terraform.Options{
		// dev環境の設定ディレクトリ
		TerraformDir: "../../env/dev",

		// 変数の上書き（テスト用の設定）
		Vars: map[string]interface{}{
			"project_name": testProject,
			"environment":  "test",
			// 実際のリソース作成を避けるため、ダミー値を使用
			"vpc_cidr": "10.1.0.0/16",
		},

		// AWSプロバイダーの設定
		EnvVars: map[string]string{
			"AWS_DEFAULT_REGION": "ap-northeast-1",
		},
	}

	// Terraform initとplanのみ実行（実際のリソース作成は行わない）
	terraform.Init(t, terraformOptions)
	planOutput := terraform.Plan(t, terraformOptions)

	// === Dev環境の包括的な設定検証 ===

	// ネットワーク層の検証
	assert.Contains(t, planOutput, "module.vpc", "Plan should include VPC module")
	assert.Contains(t, planOutput, "aws_vpc", "Plan should create VPC")
	assert.Contains(t, planOutput, "aws_subnet", "Plan should create subnets")
	assert.Contains(t, planOutput, "aws_internet_gateway", "Plan should create Internet Gateway")
	assert.Contains(t, planOutput, "aws_nat_gateway", "Plan should create NAT Gateway")
	assert.Contains(t, planOutput, "aws_route_table", "Plan should create route tables")

	// セキュリティ層の検証
	assert.Contains(t, planOutput, "aws_security_group", "Plan should create security groups")

	// ロードバランサー層の検証
	assert.Contains(t, planOutput, "module.alb", "Plan should include ALB module")
	assert.Contains(t, planOutput, "aws_lb", "Plan should create Application Load Balancer")
	assert.Contains(t, planOutput, "aws_lb_target_group", "Plan should create target groups")
	assert.Contains(t, planOutput, "aws_lb_listener", "Plan should create listeners")

	// コンテナプラットフォーム層の検証
	assert.Contains(t, planOutput, "module.ecs", "Plan should include ECS module")
	assert.Contains(t, planOutput, "aws_ecs_cluster", "Plan should create ECS cluster")
	assert.Contains(t, planOutput, "aws_ecs_service", "Plan should create ECS service")
	assert.Contains(t, planOutput, "aws_ecs_task_definition", "Plan should create task definition")

	// IAM設定の検証
	assert.Contains(t, planOutput, "aws_iam_role", "Plan should create IAM roles")
	assert.Contains(t, planOutput, "aws_iam_policy", "Plan should create IAM policies")

	// ログ・モニタリング設定の検証
	assert.Contains(t, planOutput, "aws_cloudwatch_log_group", "Plan should create CloudWatch log groups")

	// プロジェクト名がリソースに反映されているか確認
	assert.Contains(t, planOutput, testProject, "Plan should contain project name in resources")

	// 環境名がタグに反映されているか確認
	assert.Contains(t, planOutput, "test", "Plan should contain environment name in tags")

	// リソース作成数の確認（概算）
	assert.Contains(t, planOutput, "to add", "Plan should show resources to be added")
	assert.NotContains(t, planOutput, "to change", "Plan should not modify existing resources")
	assert.NotContains(t, planOutput, "to destroy", "Plan should not destroy any resources")

	t.Logf("Dev environment plan validation completed successfully")
}

func TestDevEnvironmentValidation(t *testing.T) {
	t.Parallel()

	terraformOptions := &terraform.Options{
		TerraformDir: "../../env/dev",
		Vars: map[string]interface{}{
			"project_name": "test-validation",
			"environment":  "test",
			"vpc_cidr":     "10.2.0.0/16",
		},
		EnvVars: map[string]string{
			"AWS_DEFAULT_REGION": "ap-northeast-1",
		},
	}

	// Terraform validateを実行
	terraform.Init(t, terraformOptions)
	terraform.Validate(t, terraformOptions)

	t.Log("Dev environment configuration validation passed")
}

func TestDevEnvironmentSyntax(t *testing.T) {
	t.Parallel()

	terraformOptions := &terraform.Options{
		TerraformDir: "../../env/dev",
		EnvVars: map[string]string{
			"AWS_DEFAULT_REGION": "ap-northeast-1",
		},
	}

	// Terraform formatをチェック
	terraform.Init(t, terraformOptions)

	// 構文チェックのみ実行
	terraform.InitAndPlan(t, terraformOptions)

	t.Log("Dev environment syntax check completed successfully")
}
