package test

import (
	"os"
	"testing"

	"github.com/gruntwork-io/terratest/modules/aws"
	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

func TestVpcModule(t *testing.T) {
	t.Parallel()

	terraformOptions := &terraform.Options{
		// テスト対象のTerraformコードのパス
		TerraformDir: "../../modules/vpc",
		Vars: map[string]interface{}{
			"name":                 "test-vpc",
			"cidr_block":           "10.0.0.0/16",
			"enable_dns_support":   true,
			"enable_dns_hostnames": true,
			"subnets": map[string]interface{}{
				"public": map[string]interface{}{
					"cidr_block":        "10.0.1.0/24",
					"availability_zone": "ap-northeast-1a",
					"subnet_type":       "public",
				},
				"private": map[string]interface{}{
					"cidr_block":        "10.0.2.0/24",
					"availability_zone": "ap-northeast-1a",
					"subnet_type":       "private",
				},
			},
			"create_internet_gateway": true,
			"security_groups": map[string]interface{}{
				"web-sg": map[string]interface{}{
					"name":        "web-sg",
					"description": "Security group for web servers",
				},
			},
			"security_group_rules": []map[string]interface{}{
				{
					"security_group_name": "web-sg",
					"type":                "ingress",
					"cidr_blocks":         []string{"0.0.0.0/0"},
					"from_port":           80,
					"to_port":             80,
					"protocol":            "tcp",
					"description":         "Allow HTTP inbound traffic",
				},
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

		t.Logf("VPC module plan validation passed")
		return
	}

	// ローカル環境では実際のリソース作成テストを実行
	// Terraform initとapplyを実行
	defer terraform.Destroy(t, terraformOptions)
	terraform.InitAndApply(t, terraformOptions)

	// 出力値を取得
	vpcID := terraform.Output(t, terraformOptions, "vpc_id")
	subnets := terraform.OutputMap(t, terraformOptions, "subnets")
	securityGroupIds := terraform.OutputMap(t, terraformOptions, "security_group_ids")

	// アサーション
	assert.NotEmpty(t, vpcID, "VPC ID should not be empty")
	assert.Len(t, subnets, 2, "There should be 2 subnets")
	assert.Contains(t, securityGroupIds, "web-sg", "Security group ID should be present")

	// VPCが正しいCIDRブロックを持っているかを確認
	vpc := aws.GetVpcById(t, vpcID, "ap-northeast-1")
	if vpc.CidrBlock != nil {
		actualCidrBlock := *vpc.CidrBlock
		assert.Equal(t, "10.0.0.0/16", actualCidrBlock, "VPC should have the correct CIDR block")
	} else {
		t.Fatal("VPC's CIDR block is nil")
	}

	t.Logf("VPC module test passed successfully:")
	t.Logf("  VPC ID: %s", vpcID)
	t.Logf("  Subnets: %v", subnets)
	t.Logf("  Security Groups: %v", securityGroupIds)
}
