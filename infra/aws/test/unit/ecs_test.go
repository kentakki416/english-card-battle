package test

import (
	"fmt"
	"testing"
	"time"

	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

func TestECSModulePlan(t *testing.T) {
	t.Parallel()

	// ユニークなリソース名を生成（並列実行対応）
	uniqueId := fmt.Sprintf("%d", time.Now().Unix())
	testClusterName := fmt.Sprintf("test-ecs-cluster-%s", uniqueId)

	terraformOptions := &terraform.Options{
		// テスト対象のTerraformコードのパス
		TerraformDir: "../../modules/ecs",
		Vars: map[string]interface{}{
			"cluster_name":           testClusterName,
			"task_definition_family": fmt.Sprintf("test-task-%s", uniqueId),
			"service_name":           fmt.Sprintf("test-service-%s", uniqueId),
			"cpu":                    "256",
			"memory":                 "512",
			"container_name":         "test-app",
			"container_image":        "nginx:latest",
			"container_port":         3000,
			"network_configuration": map[string]interface{}{
				"subnets":          []string{"subnet-12345678", "subnet-87654321"},
				"security_groups":  []string{"sg-12345678"},
				"assign_public_ip": false,
			},
			"target_group_arn":      "arn:aws:elasticloadbalancing:ap-northeast-1:123456789012:targetgroup/test-tg/1234567890123456",
			"log_retention_in_days": 7,
			"tags": map[string]string{
				"Environment": "test",
				"Component":   "Container",
			},
		},

		// AWSプロバイダーの設定
		EnvVars: map[string]string{
			"AWS_DEFAULT_REGION": "ap-northeast-1",
		},
	}

	// Terraform initとplanのみ実行（実際のリソース作成は行わない）
	terraform.Init(t, terraformOptions)
	planOutput := terraform.Plan(t, terraformOptions)

	// === Planの内容検証 ===
	// ECSクラスターの設定確認
	assert.Contains(t, planOutput, "aws_ecs_cluster.main", "Plan should include ECS cluster")
	assert.Contains(t, planOutput, testClusterName, "Plan should contain the test cluster name")

	// ECSタスク定義の設定確認
	assert.Contains(t, planOutput, "aws_ecs_task_definition.main", "Plan should include task definition")
	assert.Contains(t, planOutput, "test-task", "Plan should contain task definition family")
	assert.Contains(t, planOutput, "256", "Plan should contain CPU allocation")
	assert.Contains(t, planOutput, "512", "Plan should contain memory allocation")
	assert.Contains(t, planOutput, "FARGATE", "Plan should use Fargate compatibility")

	// ECSサービスの設定確認
	assert.Contains(t, planOutput, "aws_ecs_service.main", "Plan should include ECS service")
	assert.Contains(t, planOutput, "test-service", "Plan should contain service name")

	// コンテナ設定の確認
	assert.Contains(t, planOutput, "nginx:latest", "Plan should contain container image")
	assert.Contains(t, planOutput, "test-app", "Plan should contain container name")
	assert.Contains(t, planOutput, "3000", "Plan should contain container port")

	// ネットワーク設定の確認
	assert.Contains(t, planOutput, "subnet-12345678", "Plan should contain subnet")
	assert.Contains(t, planOutput, "sg-12345678", "Plan should contain security group")
	assert.Contains(t, planOutput, "assign_public_ip = false", "Plan should not assign public IP")

	// IAM設定の確認
	assert.Contains(t, planOutput, "aws_iam_role.ecs_task_execution_role", "Plan should include execution role")
	assert.Contains(t, planOutput, "aws_iam_role_policy_attachment", "Plan should include policy attachment")

	// CloudWatchログ設定の確認
	assert.Contains(t, planOutput, "aws_cloudwatch_log_group", "Plan should include log group")
	assert.Contains(t, planOutput, "/ecs/", "Plan should use ECS log group naming convention")
	assert.Contains(t, planOutput, "retention_in_days = 7", "Plan should set log retention")

	// タグの設定確認
	assert.Contains(t, planOutput, "Environment", "Plan should contain Environment tag")
	assert.Contains(t, planOutput, "Container", "Plan should contain Component tag")

	// リソース数の確認（クラスター、タスク定義、サービス、IAMロール、ポリシー、ログ）
	assert.Contains(t, planOutput, "6 to add", "Plan should create 6 resources")
}

func TestECSModuleValidation(t *testing.T) {
	t.Parallel()

	// 最小構成でのバリデーションテスト
	uniqueId := fmt.Sprintf("%d", time.Now().Unix())
	testClusterName := fmt.Sprintf("test-ecs-min-%s", uniqueId)

	terraformOptions := &terraform.Options{
		TerraformDir: "../../modules/ecs",
		Vars: map[string]interface{}{
			"cluster_name":           testClusterName,
			"task_definition_family": fmt.Sprintf("test-task-min-%s", uniqueId),
			"service_name":           fmt.Sprintf("test-service-min-%s", uniqueId),
			"cpu":                    "256",
			"memory":                 "512",
			"container_name":         "test-app-min",
			"container_image":        "nginx:latest",
			"container_port":         80,
			"network_configuration": map[string]interface{}{
				"subnets":          []string{"subnet-12345678"},
				"security_groups":  []string{"sg-12345678"},
				"assign_public_ip": false,
			},
			"target_group_arn":      "arn:aws:elasticloadbalancing:ap-northeast-1:123456789012:targetgroup/test-tg-min/1234567890123456",
			"log_retention_in_days": 7,
		},
		EnvVars: map[string]string{
			"AWS_DEFAULT_REGION": "ap-northeast-1",
		},
	}

	// Terraform validateを実行（変数なしで実行）
	terraform.Init(t, terraformOptions)

	// validateは変数なしで実行される
	validateOptions := &terraform.Options{
		TerraformDir: terraformOptions.TerraformDir,
		EnvVars:      terraformOptions.EnvVars,
	}
	terraform.Validate(t, validateOptions)

	// validateが成功すれば、設定ファイルは構文的に正しい
	t.Log("ECS module validation passed")

	// プランの実行で設定の妥当性を確認
	planOutput := terraform.Plan(t, terraformOptions)
	assert.NotEmpty(t, planOutput, "Plan should produce output")
	assert.NotContains(t, planOutput, "Error:", "Plan should not contain errors")

	// 最小構成での基本的な設定確認
	assert.Contains(t, planOutput, testClusterName, "Plan should contain cluster name")
	assert.Contains(t, planOutput, "test-app-min", "Plan should contain container name")
}
