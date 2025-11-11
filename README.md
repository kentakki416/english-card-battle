# English Card Battle

## 開発スタイル

### ブランチ戦略

## 📚 ライブラリのインストール

このプロジェクトは**pnpm Workspace**を使用したmonorepo構成です。ライブラリのインストールには必ず`pnpm`を使用してください。

## pnpm-workspace.yamlとは

`pnpm-workspace.yaml`はmonorepoのワークスペース構成を定義するファイルです。このファイルでプロジェクト内のどのディレクトリをワークスペースとして扱うかを指定します。

**現在の構成:**

```yaml
packages:
  - 'apps/*'                    # apps配下のすべてのアプリケーション
  - 'packages/*'                # packages配下の共有パッケージ
  - 'infrastructure/cdk'        # AWS CDK
  - 'infrastructure/cdk-terraform'  # CDK for Terraform
```




## プロジェクトへのインストール

```bash
# ルートディレクトリで実行
pnpm install
```

すべてのワークスペースの依存関係を一括でインストールします。


## 特定のワークスペースへのインストール

```bash
# 基本形式
pnpm --filter <workspace-name> add <package-name>

# 開発依存として追加
pnpm --filter <workspace-name> add -D <package-name>
```

## ワークスペース名の確認方法

各ワークスペースの名前は、そのディレクトリの`package.json`の`name`フィールドで確認できます。


## パッケージの削除

```bash
# 特定のワークスペースからパッケージを削除
pnpm --filter <workspace-name> remove <package-name>

# 例：adminからaxiosを削除
pnpm --filter admin remove axios
```

## よく使うコマンド

```bash
# 全ワークスペースのビルド
pnpm build

# 全ワークスペースのlint
pnpm lint

# 全ワークスペースのテスト
pnpm test

# 特定のワークスペースでコマンド実行
pnpm --filter <workspace-name> <command>

# 例：adminをビルド
pnpm --filter admin build

# 例：api-serverのテストを実行
pnpm --filter api-server test

# 依存関係の更新
pnpm update

# 特定のワークスペースだけ更新
pnpm --filter admin update

# ワークスペース一覧を表示
pnpm -r list --depth -1

# キャッシュをクリーン
pnpm store prune
```
