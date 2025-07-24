package test

import (
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

func TestECSModule(t *testing.T) {
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
			"container_port":         80,
			"subnets":                []string{"subnet-12345678", "subnet-87654321"},                                                  // テスト用ダミーID
			"security_groups":        []string{"sg-12345678"},                                                                         // テスト用ダミーID
			"target_group_arn":       "arn:aws:elasticloadbalancing:ap-northeast-1:123456789012:targetgroup/test-tg/1234567890123456", // テスト用ダミーARN
			"tags": map[string]string{
				"Environment": "test",
				"Component":   "ECS",
			},
		},

		// AWSプロバイダーの設定
		EnvVars: map[string]string{
			"AWS_DEFAULT_REGION": "ap-northeast-1",
		},
	}

	// CI環境ではplan-onlyモードで実行
	if os.Getenv("TERRATEST_PLAN_ONLY") == "true" {
		// Terraformの初期化
		terraform.Init(t, terraformOptions)

		// Planのみ実行（リソースは作成しない）
		terraform.Plan(t, terraformOptions)

		t.Logf("ECS module plan validation passed for: %s", testClusterName)
		return
	}

	// ローカル環境では実際のリソース作成テストを実行
	// テスト終了時にTerraformのリソースを破棄
	defer terraform.Destroy(t, terraformOptions)

	// Terraformの初期化と適用
	terraform.InitAndApply(t, terraformOptions)

	// === 出力値の検証 ===
	// ECSクラスターIDの検証
	clusterID := terraform.Output(t, terraformOptions, "cluster_id")
	assert.NotEmpty(t, clusterID, "ECS Cluster ID should not be empty")
	assert.Contains(t, clusterID, testClusterName, "Cluster ID should contain the test name")

	// ECSクラスターARNの検証
	clusterArn := terraform.Output(t, terraformOptions, "cluster_arn")
	assert.NotEmpty(t, clusterArn, "ECS Cluster ARN should not be empty")
	assert.Contains(t, clusterArn, "arn:aws:ecs", "Cluster ARN should be a valid ECS ARN")

	// タスク定義ARNの検証
	taskDefinitionArn := terraform.Output(t, terraformOptions, "task_definition_arn")
	assert.NotEmpty(t, taskDefinitionArn, "Task Definition ARN should not be empty")
	assert.Contains(t, taskDefinitionArn, "arn:aws:ecs", "Task Definition ARN should be valid")

	// ECSサービス名の検証
	serviceName := terraform.Output(t, terraformOptions, "service_name")
	assert.NotEmpty(t, serviceName, "Service name should not be empty")
	assert.Contains(t, serviceName, "test-service", "Service name should contain test-service")

	t.Logf("ECS created successfully:")
	t.Logf("  Cluster ID: %s", clusterID)
	t.Logf("  Cluster ARN: %s", clusterArn)
	t.Logf("  Task Definition ARN: %s", taskDefinitionArn)
	t.Logf("  Service Name: %s", serviceName)
}

func TestECSModuleMinimalConfig(t *testing.T) {
	t.Parallel()

	// ユニークなリソース名を生成
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
			"container_name":         "test-app",
			"container_image":        "nginx:latest",
			"container_port":         80,
			"subnets":                []string{"subnet-12345678"},                                                                     // テスト用ダミーID
			"security_groups":        []string{"sg-12345678"},                                                                         // テスト用ダミーID
			"target_group_arn":       "arn:aws:elasticloadbalancing:ap-northeast-1:123456789012:targetgroup/test-tg/1234567890123456", // テスト用ダミーARN
			// 最小限の設定でテスト
		},
		EnvVars: map[string]string{
			"AWS_DEFAULT_REGION": "ap-northeast-1",
		},
	}

	// CI環境ではplan-onlyモードで実行
	if os.Getenv("TERRATEST_PLAN_ONLY") == "true" {
		// Terraformの初期化
		terraform.Init(t, terraformOptions)

		// Planのみ実行（リソースは作成しない）
		terraform.Plan(t, terraformOptions)

		t.Logf("ECS minimal module plan validation passed for: %s", testClusterName)
		return
	}

	// ローカル環境では実際のリソース作成テストを実行
	defer terraform.Destroy(t, terraformOptions)
	terraform.InitAndApply(t, terraformOptions)

	// 基本的な出力値の検証
	clusterArn := terraform.Output(t, terraformOptions, "cluster_arn")
	assert.NotEmpty(t, clusterArn, "ECS Cluster ARN should not be empty")

	taskDefinitionArn := terraform.Output(t, terraformOptions, "task_definition_arn")
	assert.NotEmpty(t, taskDefinitionArn, "Task Definition ARN should not be empty")

	t.Logf("Minimal ECS configuration test passed: %s", clusterArn)
}
