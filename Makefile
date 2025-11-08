.PHONY: dev dev-admin dev-web dev-server dev-mongo down clean install lint build mongosh

# 全サービスを起動
dev:
	@echo "Starting all services with pnpm..."
	pnpm dev

# 管理画面のみ起動
dev-admin:
	@echo "Starting admin application..."
	pnpm --filter admin dev

# Webのみ起動
dev-web:
	@echo "Starting web application..."
	pnpm --filter client dev

# サーバーのみ起動
dev-server:
	@echo "Starting API server..."
	pnpm --filter api-server dev

# MongoDBのみ起動
dev-mongo:
	@echo "Starting MongoDB..."
	cd apps/api-server && docker-compose up mongo -d

# 全サービスを停止
down:
	@echo "Stopping all services..."
	cd apps/api-server && docker-compose down
	@echo "Services stopped"

# コンテナとボリュームをクリーンアップ
clean:
	@echo "Cleaning up containers and volumes..."
	cd apps/api-server && docker-compose down --volumes --remove-orphans
	@echo "Cleanup completed"

# 全サービスの依存関係をインストール
install:
	@echo "Installing all dependencies with pnpm..."
	pnpm install

# Lint実行
lint:
	@echo "Running lint..."
	pnpm lint

# Lint修正
lint-fix:
	@echo "Fixing lint issues..."
	pnpm lint:fix

# ビルド実行
build:
	@echo "Building all projects..."
	pnpm build

# MongoDB接続
mongosh:
	@echo "Connecting to MongoDB..."
	cd apps/api-server && docker exec -it mongo mongosh -u root -p password
