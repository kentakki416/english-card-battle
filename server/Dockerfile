########################################################
# 実行環境に必要なパッケージのインストール
########################################################
FROM node:20-alpine3.17 AS install
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

########################################################
# ビルド
########################################################
FROM node:20-alpine3.17 AS build
WORKDIR /work
COPY package*.json tsconfig*.json ./
RUN npm ci
COPY . .
RUN npm run build

########################################################
# ランタイム
########################################################
FROM node:20-alpine3.17 AS runtime
WORKDIR /app
RUN apk add --no-cache tini
COPY --from=install --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /work/dist ./dist
ENTRYPOINT [ "/sbin/tini", "--" ]
USER node
EXPOSE 8080
ENV NODE_ENV=prd
CMD ["node", "dist/index.js", "--max-old-space-size=400"]


########################################################
# 開発・テスト環境用パッケージのインストール
########################################################
FROM node:20-alpine3.17 AS install-dev
WORKDIR /app
COPY package*.json ./
RUN npm ci

########################################################
# テスト環境
########################################################
FROM node:20-alpine3.17 AS test
WORKDIR /app
# 開発依存関係も含めてnode_modulesをコピー
COPY --from=install-dev --chown=node:node /app/node_modules ./node_modules
# ソースコードとビルド成果物をコピー
COPY --chown=node:node . .
COPY --from=build --chown=node:node /work/dist ./dist
# テスト用環境変数を設定
ENV NODE_ENV=test
ENV TEST_MONGO_URI=mongodb://root:password@mongo:27017/test_db
# 権限設定
USER node
EXPOSE 8080
# デフォルトコマンドをテスト実行に設定
CMD ["npm", "run", "test:coverage"]
