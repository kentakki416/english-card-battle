## 実行環境に必要なパッケージのインストール
FROM node:20-alpine3.17 AS install
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

## ビルド
FROM node:20-alpine3.17 AS build
WORKDIR /work
COPY package*.json tsconfig*.json ./
RUN npm ci
COPY . .
RUN npm run build

## ランタイム
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
