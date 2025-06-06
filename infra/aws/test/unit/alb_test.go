package test

import (
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

func TestALBModule(t *testing.T) {
	t.Parallel()

	// ユニークなリソース名を生成（並列実行対応）
	uniqueId := fmt.Sprintf("%d", time.Now().Unix())
	testName := fmt.Sprintf("test-alb-%s", uniqueId)

	terraformOptions := &terraform.Options{
		// テスト対象のTerraformコードのパス
		TerraformDir: "../../modules/alb",
		Vars: map[string]interface{}{
			"name":              testName,
			"vpc_id":            "vpc-12345678", // テスト用のダミーID
			"security_groups":   []string{"sg-12345678"},
			"subnets":           []string{"subnet-12345678", "subnet-87654321"},
			"target_group_port": 3000,
			"listener_port":     "80",
			"tags": map[string]string{
				"Environment": "test",
				"Component":   "LoadBalancer",
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

		t.Logf("ALB module plan validation passed for: %s", testName)
		return
	}

	// ローカル環境では実際のリソース作成テストを実行
	// テスト終了時にTerraformのリソースを破棄
	defer terraform.Destroy(t, terraformOptions)

	// Terraformの初期化と適用
	terraform.InitAndApply(t, terraformOptions)

	// === 出力値の検証 ===
	// ALB IDの検証
	albID := terraform.Output(t, terraformOptions, "alb_id")
	assert.NotEmpty(t, albID, "ALB ID should not be empty")
	assert.Contains(t, albID, "arn:aws:elasticloadbalancing", "ALB ID should be a valid ARN")

	// ALB ARNの検証
	albArn := terraform.Output(t, terraformOptions, "alb_arn")
	assert.NotEmpty(t, albArn, "ALB ARN should not be empty")
	assert.Contains(t, albArn, testName, "ALB ARN should contain the test name")

	// ALB DNS名の検証
	albDnsName := terraform.Output(t, terraformOptions, "alb_dns_name")
	assert.NotEmpty(t, albDnsName, "ALB DNS name should not be empty")
	assert.Contains(t, albDnsName, "elb.amazonaws.com", "ALB DNS name should have correct format")

	// ALB Zone IDの検証
	albZoneId := terraform.Output(t, terraformOptions, "alb_zone_id")
	assert.NotEmpty(t, albZoneId, "ALB Zone ID should not be empty")

	// ターゲットグループARNの検証
	targetGroupArn := terraform.Output(t, terraformOptions, "target_group_arn")
	assert.NotEmpty(t, targetGroupArn, "Target Group ARN should not be empty")
	assert.Contains(t, targetGroupArn, "arn:aws:elasticloadbalancing", "Target Group ARN should be valid")

	// リスナーARNの検証
	listenerArn := terraform.Output(t, terraformOptions, "listener_arn")
	assert.NotEmpty(t, listenerArn, "Listener ARN should not be empty")
	assert.Contains(t, listenerArn, "arn:aws:elasticloadbalancing", "Listener ARN should be valid")

	t.Logf("ALB created successfully:")
	t.Logf("  ALB ID: %s", albID)
	t.Logf("  ALB DNS Name: %s", albDnsName)
	t.Logf("  Target Group ARN: %s", targetGroupArn)
}

func TestALBModuleMinimalConfig(t *testing.T) {
	t.Parallel()

	// ユニークなリソース名を生成
	uniqueId := fmt.Sprintf("%d", time.Now().Unix())
	testName := fmt.Sprintf("test-alb-min-%s", uniqueId)

	terraformOptions := &terraform.Options{
		TerraformDir: "../../modules/alb",
		Vars: map[string]interface{}{
			"name":              testName,
			"vpc_id":            "vpc-12345678", // テスト用のダミーID
			"security_groups":   []string{"sg-12345678"},
			"subnets":           []string{"subnet-12345678", "subnet-87654321"},
			"target_group_port": 80,
			"listener_port":     "80",
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

		t.Logf("ALB minimal module plan validation passed for: %s", testName)
		return
	}

	// ローカル環境では実際のリソース作成テストを実行
	defer terraform.Destroy(t, terraformOptions)
	terraform.InitAndApply(t, terraformOptions)

	// 基本的な出力値の検証
	albArn := terraform.Output(t, terraformOptions, "alb_arn")
	assert.NotEmpty(t, albArn, "ALB ARN should not be empty")

	targetGroupArn := terraform.Output(t, terraformOptions, "target_group_arn")
	assert.NotEmpty(t, targetGroupArn, "Target Group ARN should not be empty")

	t.Logf("Minimal ALB configuration test passed: %s", albArn)
}
