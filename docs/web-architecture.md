# Web アーキテクチャ設計書

## ディレクトリ構成
```
web/
├── app/                    # Next.js App Router（ページ・API）
│   ├── (auth)/            # 認証関連ページ（グループ化）
│   ├── api/               # API Routes
│   ├── globals.css        # グローバルスタイル（必須）
│   ├── layout.tsx         # ルートレイアウト（必須）
│   ├── page.tsx           # ホームページ
│   └── providers.tsx      # プロバイダー設定（認証用）
├── components/             # Reactコンポーネント
│   ├── ui/                # 基本UIコンポーネント
│   ├── auth/              # 認証関連コンポーネント
│   ├── game/              # ゲーム関連コンポーネント
│   ├── dashboard/         # ダッシュボード関連コンポーネント
│   ├── layout/            # レイアウト関連コンポーネント
│   └── common/            # 共通コンポーネント
├── lib/                   # ユーティリティ・ライブラリ
│   ├── utils.ts           # 汎用ユーティリティ
│   ├── auth.ts            # 認証関連ユーティリティ
│   ├── api.ts             # API呼び出しユーティリティ
├── hooks/                 # カスタムフック
│   ├── use-auth.ts        # 認証フック
│   ├── use-quiz.ts        # クイズフック
│   └── use-stats.ts       # 統計フック
├── types/                 # TypeScript型定義
│   ├── auth.ts            # 認証関連型
│   ├── quiz.ts            # クイズ関連型
│   └── api.ts             # API関連型
├── styles/                # 追加スタイル
│   ├── components.css     # コンポーネントスタイル
│   └── animations.css     # アニメーション
├── public/                # 静的ファイル
│   ├── assets/            # 画像・アイコン
│   └── favicon.ico        # ファビコン
├── package.json           # 依存関係
├── next.config.mjs        # Next.js設定
├── tailwind.config.ts     # Tailwind CSS設定
└── tsconfig.json          # TypeScript設定
```
