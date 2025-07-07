.PHONY: help dev dev-server dev-web dev-mongo down clean install install-server install-web

# デフォルトターゲット
help:
	@echo "Available commands:"
	@echo "  dev          - Start all services (web, server, mongo)"
	@echo "  dev-server    - Start server only"
	@echo "  dev-web       - Start web only"
	@echo "  dev-mongo     - Start mongo only"
	@echo "  down          - Stop all services"
	@echo "  clean         - Clean up containers and volumes"
	@echo "  install       - Install dependencies for all services"
	@echo "  install-server - Install server dependencies"
	@echo "  install-web   - Install web dependencies"

# 全サービスを起動
dev: install
	@echo "Starting all services..."
	@make dev-mongo &
	@sleep 3
	@make dev-server &
	@sleep 2
	@make dev-web

# サーバーのみ起動
dev-server:
	@echo "Starting server..."
	cd server && npm run dev

# Webのみ起動
dev-web:
	@echo "Starting web application..."
	cd web && npm run dev

# MongoDBのみ起動
dev-mongo:
	@echo "Starting MongoDB..."
	cd server && docker-compose up mongo -d

# 全サービスを停止
down:
	@echo "Stopping all services..."
	cd server && docker-compose down
	@echo "Services stopped"

# コンテナとボリュームをクリーンアップ
clean:
	@echo "Cleaning up containers and volumes..."
	cd server && docker-compose down --volumes --remove-orphans
	@echo "Cleanup completed"

# 全サービスの依存関係をインストール
install: install-server install-web

# サーバーの依存関係をインストール
install-server:
	@echo "Installing server dependencies..."
	cd server && npm install

# Webの依存関係をインストール
install-web:
	@echo "Installing web dependencies..."
	cd web && npm install 
