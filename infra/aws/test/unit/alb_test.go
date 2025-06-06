package test

import (
	"fmt"
	"testing"
	"time"

	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

func TestALBModulePlan(t *testing.T) {
	t.Parallel()

	// ユニークなリソース名を生成（並列実行対応）
	uniqueId := fmt.Sprintf("%d", time.Now().Unix())
	testName := fmt.Sprintf("test-alb-%s", uniqueId)

	terraformOptions := &terraform.Options{
		// テスト対象のTerraformコードのパス
		TerraformDir: "../../modules/alb",
		Vars: map[string]interface{}{
			"name":              testName,
			"vpc_id":            "vpc-12345678", // ダミーVPC ID
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

	// Terraform initとplanのみ実行（実際のリソース作成は行わない）
	terraform.Init(t, terraformOptions)
	planOutput := terraform.Plan(t, terraformOptions)

	// === Planの内容検証 ===
	// ALBの設定が含まれているか確認
	assert.Contains(t, planOutput, "aws_lb.main", "Plan should include ALB resource")
	assert.Contains(t, planOutput, testName, "Plan should contain the test ALB name")
	assert.Contains(t, planOutput, "application", "Plan should specify application load balancer")

	// ターゲットグループの設定確認
	assert.Contains(t, planOutput, "aws_lb_target_group.main", "Plan should include target group")
	assert.Contains(t, planOutput, "3000", "Plan should contain target group port")
	assert.Contains(t, planOutput, "HTTP", "Plan should use HTTP protocol")

	// リスナーの設定確認
	assert.Contains(t, planOutput, "aws_lb_listener.main", "Plan should include listener")
	assert.Contains(t, planOutput, "80", "Plan should contain listener port")

	// セキュリティグループとサブネットの設定確認
	assert.Contains(t, planOutput, "sg-12345678", "Plan should contain security group")
	assert.Contains(t, planOutput, "subnet-12345678", "Plan should contain subnet")

	// タグの設定確認
	assert.Contains(t, planOutput, "Environment", "Plan should contain Environment tag")
	assert.Contains(t, planOutput, "LoadBalancer", "Plan should contain Component tag")

	// リソース数の確認（ALB、ターゲットグループ、リスナー）
	assert.Contains(t, planOutput, "3 to add", "Plan should create 3 resources")
}

func TestALBModuleValidation(t *testing.T) {
	t.Parallel()

	// 最小構成でのバリデーションテスト
	uniqueId := fmt.Sprintf("%d", time.Now().Unix())
	testName := fmt.Sprintf("test-alb-min-%s", uniqueId)

	terraformOptions := &terraform.Options{
		TerraformDir: "../../modules/alb",
		Vars: map[string]interface{}{
			"name":              testName,
			"vpc_id":            "vpc-12345678",
			"security_groups":   []string{"sg-12345678"},
			"subnets":           []string{"subnet-12345678", "subnet-87654321"},
			"target_group_port": 80,
			"listener_port":     "80",
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
	t.Log("ALB module validation passed")

	// プランの実行で設定の妥当性を確認
	planOutput := terraform.Plan(t, terraformOptions)
	assert.NotEmpty(t, planOutput, "Plan should produce output")
	assert.NotContains(t, planOutput, "Error:", "Plan should not contain errors")
}
