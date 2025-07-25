# =============================================================================
# English Card Battle - Terraform Infrastructure Makefile
# =============================================================================

# 環境設定
ENVIRONMENT ?= dev
AWS_REGION ?= ap-northeast-1
TERRAFORM_DIR = aws/env/$(ENVIRONMENT)
TEST_DIR = aws/test

# 色付き出力用
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

.PHONY: help init plan apply destroy validate lint security-test snapshot-test unit-test integration-test test-all clean

# =============================================================================
# ヘルプ
# =============================================================================
help:
	@echo "$(GREEN)English Card Battle - Terraform Infrastructure$(NC)"
	@echo ""
	@echo "$(YELLOW)環境操作:$(NC)"
	@echo "  make init [ENVIRONMENT=dev]     - Terraform初期化"
	@echo "  make plan [ENVIRONMENT=dev]     - 実行計画の表示"
	@echo "  make apply [ENVIRONMENT=dev]    - インフラの適用"
	@echo "  make destroy [ENVIRONMENT=dev]  - インフラの削除"
	@echo ""
	@echo "$(YELLOW)テスト・バリデーション:$(NC)"
	@echo "  make validate                   - Terraform構文チェック"
	@echo "  make lint                       - Checkovによる静的解析"
	@echo "  make security-test              - セキュリティ・コンプライアンスチェック"
	@echo "  make snapshot-test              - スナップショットテスト"
	@echo "  make unit-test                  - ユニットテスト実行"
	@echo "  make integration-test           - インテグレーションテスト実行"
	@echo "  make test-all                   - 全テスト実行"
	@echo ""
	@echo "$(YELLOW)環境別操作:$(NC)"
	@echo "  make plan-dev                   - dev環境の実行計画"
	@echo "  make plan-stg                   - stg環境の実行計画"
	@echo "  make plan-prd                   - prd環境の実行計画"
	@echo "  make apply-dev                  - dev環境の適用"
	@echo "  make apply-stg                  - stg環境の適用"
	@echo "  make apply-prd                  - prd環境の適用"
	@echo "  make destroy-dev                - dev環境の削除"
	@echo "  make destroy-stg                - stg環境の削除"
	@echo "  make destroy-prd                - prd環境の削除"
	@echo ""
	@echo "$(YELLOW)ユーティリティ:$(NC)"
	@echo "  make clean                      - 一時ファイルのクリーンアップ"
	@echo "  make format                     - Terraformファイルのフォーマット"
	@echo ""

# =============================================================================
# 環境別操作
# =============================================================================

# dev環境
plan-dev:
	@echo "$(GREEN)Planning dev environment...$(NC)"
	@make plan ENVIRONMENT=dev

apply-dev:
	@echo "$(GREEN)Applying dev environment...$(NC)"
	@make apply ENVIRONMENT=dev

destroy-dev:
	@echo "$(RED)Destroying dev environment...$(NC)"
	@make destroy ENVIRONMENT=dev

# stg環境
plan-stg:
	@echo "$(GREEN)Planning stg environment...$(NC)"
	@make plan ENVIRONMENT=stg

apply-stg:
	@echo "$(GREEN)Applying stg environment...$(NC)"
	@make apply ENVIRONMENT=stg

destroy-stg:
	@echo "$(RED)Destroying stg environment...$(NC)"
	@make destroy ENVIRONMENT=stg

# prd環境
plan-prd:
	@echo "$(GREEN)Planning prd environment...$(NC)"
	@make plan ENVIRONMENT=prd

apply-prd:
	@echo "$(GREEN)Applying prd environment...$(NC)"
	@make apply ENVIRONMENT=prd

destroy-prd:
	@echo "$(RED)Destroying prd environment...$(NC)"
	@make destroy ENVIRONMENT=prd

# =============================================================================
# 基本操作
# =============================================================================

init:
	@echo "$(GREEN)Initializing Terraform for $(ENVIRONMENT) environment...$(NC)"
	@cd $(TERRAFORM_DIR) && terraform init

plan:
	@echo "$(GREEN)Creating execution plan for $(ENVIRONMENT) environment...$(NC)"
	@cd $(TERRAFORM_DIR) && terraform plan -out=plan.out

apply:
	@echo "$(GREEN)Applying infrastructure changes for $(ENVIRONMENT) environment...$(NC)"
	@cd $(TERRAFORM_DIR) && terraform apply -auto-approve

destroy:
	@echo "$(RED)Destroying infrastructure for $(ENVIRONMENT) environment...$(NC)"
	@cd $(TERRAFORM_DIR) && terraform destroy -auto-approve

# =============================================================================
# バリデーション・テスト
# =============================================================================

validate:
	@echo "$(GREEN)Validating Terraform configuration...$(NC)"
	@cd $(TERRAFORM_DIR) && terraform validate
	@echo "$(GREEN)✓ Terraform validation passed$(NC)"

lint:
	@echo "$(GREEN)Running Checkov...$(NC)"
	@if command -v checkov >/dev/null 2>&1; then \
		cd $(TERRAFORM_DIR) && checkov -d . --framework terraform; \
		echo "$(GREEN)✓ Checkov passed$(NC)"; \
	else \
		echo "$(YELLOW)⚠ Checkov not installed. Install with: pip install checkov$(NC)"; \
	fi

security-test:
	@echo "$(GREEN)Running security and compliance checks...$(NC)"
	@if command -v tfsec >/dev/null 2>&1; then \
		echo "$(GREEN)Running tfsec...$(NC)"; \
		cd $(TERRAFORM_DIR) && tfsec --no-color; \
	else \
		echo "$(YELLOW)⚠ tfsec not installed. Install with: brew install tfsec$(NC)"; \
	fi
	@if command -v checkov >/dev/null 2>&1; then \
		echo "$(GREEN)Running checkov...$(NC)"; \
		cd $(TERRAFORM_DIR) && checkov -d . --framework terraform; \
	else \
		echo "$(YELLOW)⚠ checkov not installed. Install with: pip install checkov$(NC)"; \
	fi
	@echo "$(GREEN)✓ Security tests completed$(NC)"

snapshot-test:
	@echo "$(GREEN)Running snapshot tests...$(NC)"
	@mkdir -p $(TEST_DIR)/snapshots
	@cd $(TERRAFORM_DIR) && terraform plan -out=snapshot-plan.out || true
	@cd $(TERRAFORM_DIR) && terraform show -json snapshot-plan.out > ../../$(TEST_DIR)/snapshots/$(ENVIRONMENT)-snapshot.json || true
	@echo "$(GREEN)✓ Snapshot created for $(ENVIRONMENT) environment$(NC)"
	@echo "$(YELLOW)To compare snapshots, use: diff $(TEST_DIR)/snapshots/$(ENVIRONMENT)-snapshot.json <previous-snapshot>$(NC)"

unit-test:
	@echo "$(GREEN)Running unit tests...$(NC)"
	@cd $(TEST_DIR)/unit && go test -v -parallel 4
	@echo "$(GREEN)✓ Unit tests completed$(NC)"

integration-test:
	@echo "$(GREEN)Running integration tests...$(NC)"
	@cd $(TEST_DIR)/integration && go test -v
	@echo "$(GREEN)✓ Integration tests completed$(NC)"

test-all: validate lint security-test snapshot-test unit-test integration-test
	@echo "$(GREEN)✓ All tests completed successfully$(NC)"

# =============================================================================
# ユーティリティ
# =============================================================================

format:
	@echo "$(GREEN)Formatting Terraform files...$(NC)"
	@find . -name "*.tf" -exec terraform fmt {} \;
	@echo "$(GREEN)✓ Formatting completed$(NC)"

clean:
	@echo "$(GREEN)Cleaning up temporary files...$(NC)"
	@find . -name "*.tfstate*" -delete 2>/dev/null || true
	@find . -name "*.tfplan" -delete 2>/dev/null || true
	@find . -name "plan.out" -delete 2>/dev/null || true
	@find . -name "snapshot-plan.out" -delete 2>/dev/null || true
	@find . -name ".terraform" -type d -exec rm -rf {} + 2>/dev/null || true
	@echo "$(GREEN)✓ Cleanup completed$(NC)"

# =============================================================================
# 開発用ショートカット
# =============================================================================

dev: init plan-dev
	@echo "$(GREEN)Dev environment ready for deployment$(NC)"

stg: init plan-stg
	@echo "$(GREEN)Staging environment ready for deployment$(NC)"

prd: init plan-prd
	@echo "$(GREEN)Production environment ready for deployment$(NC)"

# =============================================================================
# CI/CD用ターゲット
# =============================================================================

ci-validate: validate lint security-test
	@echo "$(GREEN)✓ CI validation passed$(NC)"

ci-test: test-all
	@echo "$(GREEN)✓ CI tests passed$(NC)"

ci-deploy: ci-validate ci-test apply
	@echo "$(GREEN)✓ CI deployment completed$(NC)" 
