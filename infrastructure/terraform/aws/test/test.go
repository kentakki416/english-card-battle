package test

import (
	"testing"

	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

func TestTerraformVPC(t *testing.T) {
	// Terraformのオプションを設定
	terraformOptions := &terraform.Options{
		TerraformDir: "../aws/modules/common/vpc",
		Vars: map[string]interface{}{
			"cidr_block":              "10.0.0.0/16",
			"name":                    "test",
			"enable_dns_support":      true,
			"enable_dns_hostnames":    true,
			"create_internet_gateway": true,
			"subnets": map[string]interface{}{
				"subnet1": map[string]interface{}{
					"cidr_block":        "10.0.1.0/24",
					"availability_zone": "us-west-2a",
					"subnet_type":       "public",
				},
			},
			"route_tables": map[string]interface{}{
				"route_table1": map[string]interface{}{
					"subnet_id":      "subnet-12345678",
					"route_table_id": "rtb-12345678",
				},
			},
			"security_groups": map[string]interface{}{
				"sg1": map[string]interface{}{
					"name":        "test-sg",
					"description": "Test security group",
				},
			},
			"security_group_rules": []map[string]interface{}{
				{
					"security_group_name": "sg1",
					"type":                "ingress",
					"from_port":           80,
					"to_port":             80,
					"protocol":            "tcp",
					"cidr_blocks":         []string{"0.0.0.0/0"},
				},
			},
		},
	}

	// テスト終了時にTerraformのリソースを破棄
	defer terraform.Destroy(t, terraformOptions)
	// Terraformの初期化と適用
	terraform.InitAndApply(t, terraformOptions)

	// VPCのIDを取得して検証
	vpcID := terraform.Output(t, terraformOptions, "vpc_id")
	assert.NotEmpty(t, vpcID)

	// サブネットのIDを取得して検証
	subnetID := terraform.Output(t, terraformOptions, "subnet_id")
	assert.NotEmpty(t, subnetID)

	// インターネットゲートウェイのIDを取得して検証
	igwID := terraform.Output(t, terraformOptions, "igw_id")
	assert.NotEmpty(t, igwID)

	// ルートテーブルのIDを取得して検証
	routeTableID := terraform.Output(t, terraformOptions, "route_table_id")
	assert.NotEmpty(t, routeTableID)

	// セキュリティグループのIDを取得して検証
	securityGroupID := terraform.Output(t, terraformOptions, "security_group_id")
	assert.NotEmpty(t, securityGroupID)
}
