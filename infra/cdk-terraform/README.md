# English Card Battle - CDK for Terraform (CDKTF)

このディレクトリには、English Card Battleのインフラストラクチャを定義するCDK for Terraform (CDKTF) コードが含まれています。

## 🚀 環境構築

### 1. CDKTF CLIのインストール
```bash
npm install -g cdktf-cli
```

### 2. プロジェクト初期化
```bash
# TypeScriptテンプレートで初期化（AWSプロバイダー指定）
cdktf init --template="typescript" --providers="aws@~>4.0" --local
```

#### 初期化コマンドの詳細解説

このコマンドは以下の処理を実行します：

1. **テンプレート選択**: `--template="typescript"`
2. **プロバイダー指定**: `--providers="aws@~>4.0"`
3. **プロジェクトID生成**: 一意のプロジェクトIDを自動生成
4. **基本ファイル作成**: テスト、セットアップ、ヘルプファイルを生成


### 3. プロバイダーコードの生成
```bash
# プロバイダーのコード生成
cdktf get
```
- プロバイダーコード： 
   - TerraformのプロバイダーをTypescriptで使用するために自動生成される型安全なコード
   - => Terraformのリソース定義をTypeScriptで安全に書くための橋渡し

### 4. 依存関係のインストール
```bash
npm install
```

## 📁 プロジェクト構造

| ファイル/ディレクトリ | 説明 | 役割 |
|---------------------|------|------|
| `main.ts` | メインアプリケーションファイル | CDKTFアプリケーションのエントリーポイント |
| `cdktf.json` | CDKTF設定ファイル | プロジェクトの基本設定、プロバイダー、モジュール定義 |
| `setup.js` | テストセットアップ | Jestテスト環境の初期化 |
| `.gen/` | 生成されたプロバイダーコード | `cdktf get`で生成されるTerraformプロバイダーのTypeScriptコード |
| `.gen/providers/aws/` | AWSプロバイダーコード | AWSリソースの型定義とコンストラクト |
| `__tests__/` | テストディレクトリ | ユニットテストファイル |

## 🛠️ CDK-Terraformコマンド詳細解説

### 基本コマンド

#### `cdktf init` - プロジェクト初期化
**内部挙動:**
1. テンプレートのダウンロードと展開
2. 設定ファイルの生成（`cdktf.json`、`package.json`など）
3. プロバイダー設定の追加
4. 基本ファイル構造の作成
5. プロジェクトIDの生成

**オプション:**
- `--template`: 使用するテンプレート（typescript, python, java, csharp, go）
- `--providers`: 初期プロバイダーの指定
- `--local`: ローカルバックエンドを使用
- `--from-terraform-project`: 既存のTerraformプロジェクトから変換

#### `cdktf get` - プロバイダーコード生成
**内部挙動:**
1. `cdktf.json`からプロバイダーとモジュールを読み取り
2. Terraform Registryからプロバイダースキーマをダウンロード
3. TypeScriptコードを生成（`.gen/`ディレクトリ）
4. 型定義とコンストラクトクラスを作成

**生成されるファイル:**
- `.gen/providers/`: プロバイダーコード
- `.gen/modules/`: モジュールコード
- `.gen/constraints.json`: バージョン制約
- `.gen/versions.json`: 使用バージョン情報

#### `cdktf synth` - Terraformコード合成
**内部挙動:**
1. TypeScriptコードをコンパイル
2. CDKTFアプリケーションを実行
3. Terraformリソース定義を生成
4. `cdktf.out/`ディレクトリに出力

**出力構造:**
```
cdktf.out/
├── manifest.json          # スタック情報
└── stacks/
    └── [stack-name]/
        ├── cdk.tf.json    # Terraform設定
        └── metadata.json  # スタックメタデータ
```

#### `cdktf deploy` - デプロイ実行
**内部挙動:**
1. `cdktf synth`を実行
2. Terraformの初期化（`terraform init`）
3. プランの実行（`terraform plan`）
4. 適用の実行（`terraform apply`）

**オプション:**
- `--auto-approve`: 承認なしでデプロイ
- `--parallelism`: 並列実行数
- `--refresh-only`: 状態の更新のみ

#### `cdktf diff` - 差分確認
**内部挙動:**
1. `cdktf synth`を実行
2. 現在の状態と比較
3. 変更予定のリソースを表示

#### `cdktf destroy` - リソース削除
**内部挙動:**
1. `cdktf synth`を実行
2. 削除プランの確認
3. リソースの削除実行
