package test

import (
	"fmt"
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
			"subnets":                []string{"subnet-12345678", "subnet-87654321"},                                                  // 実際のサブネットIDが必要
			"security_groups":        []string{"sg-12345678"},                                                                         // 実際のセキュリティグループIDが必要
			"target_group_arn":       "arn:aws:elasticloadbalancing:ap-northeast-1:123456789012:targetgroup/test-tg/1234567890123456", // 実際のターゲットグループARNが必要
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

	// テスト終了時にTerraformのリソースを破棄
	defer terraform.Destroy(t, terraformOptions)

	// Terraformの初期化と適用
	terraform.InitAndApply(t, terraformOptions)

	// === 出力値の検証 ===
	// ECSクラスターIDの検証
	clusterID := terraform.Output(t, terraformOptions, "cluster_id")
	assert.NotEmpty(t, clusterID, "ECS Cluster ID should not be empty")
	assert.Contains(t, clusterID, testClusterName, "Cluster ID should contain the test cluster name")

	// ECSクラスターARNの検証
	clusterArn := terraform.Output(t, terraformOptions, "cluster_arn")
	assert.NotEmpty(t, clusterArn, "ECS Cluster ARN should not be empty")
	assert.Contains(t, clusterArn, "arn:aws:ecs", "Cluster ARN should be a valid ECS ARN")
	assert.Contains(t, clusterArn, testClusterName, "Cluster ARN should contain the test cluster name")

	// タスク定義ARNの検証
	taskDefinitionArn := terraform.Output(t, terraformOptions, "task_definition_arn")
	assert.NotEmpty(t, taskDefinitionArn, "Task Definition ARN should not be empty")
	assert.Contains(t, taskDefinitionArn, "arn:aws:ecs", "Task Definition ARN should be a valid ECS ARN")
	assert.Contains(t, taskDefinitionArn, fmt.Sprintf("test-task-%s", uniqueId), "Task Definition ARN should contain the test task name")

	// ECSサービス名の検証
	serviceName := terraform.Output(t, terraformOptions, "service_name")
	assert.NotEmpty(t, serviceName, "ECS Service name should not be empty")
	assert.Equal(t, fmt.Sprintf("test-service-%s", uniqueId), serviceName, "Service name should match the expected value")

	t.Logf("ECS resources created successfully:")
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
			"subnets":                []string{"subnet-12345678"},
			"security_groups":        []string{"sg-12345678"},
			"target_group_arn":       "arn:aws:elasticloadbalancing:ap-northeast-1:123456789012:targetgroup/test-tg/1234567890123456",
			// 最小限の設定でテスト
		},
		EnvVars: map[string]string{
			"AWS_DEFAULT_REGION": "ap-northeast-1",
		},
	}

	defer terraform.Destroy(t, terraformOptions)
	terraform.InitAndApply(t, terraformOptions)

	// 基本的な出力値の検証
	clusterArn := terraform.Output(t, terraformOptions, "cluster_arn")
	assert.NotEmpty(t, clusterArn, "ECS Cluster ARN should not be empty")

	taskDefinitionArn := terraform.Output(t, terraformOptions, "task_definition_arn")
	assert.NotEmpty(t, taskDefinitionArn, "Task Definition ARN should not be empty")

	t.Logf("Minimal ECS configuration test passed: %s", clusterArn)
}
