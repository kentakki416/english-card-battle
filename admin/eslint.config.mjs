import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tailwindcss from "eslint-plugin-tailwindcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      tailwindcss,
    },
    rules: {
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/enforces-negative-arbitrary-values": "warn",
      "tailwindcss/enforces-shorthand": "warn",
      "tailwindcss/migration-from-tailwind-2": "warn",
      "tailwindcss/no-arbitrary-value": "off",
      "tailwindcss/no-custom-classname": "warn",
      "tailwindcss/no-contradicting-classname": "error",
      "tailwindcss/no-unnecessary-arbitrary-value": "error",
      // クォートをダブルクォートに統一
      "quotes": ["error", "double"],
      // 行の最大文字数を180文字に設定
      // "max-len": ["error", { "code": 180 }],
      // セミコロンを禁止
      "semi": ["error", "never"],

      // importの順序ルール
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",    // Node.jsの組み込みモジュール
            "external",   // npmパッケージ
            "internal",   // 内部モジュール
            "parent",     // 親ディレクトリ
            "sibling",    // 同じディレクトリ
            "index"       // インデックスファイル
          ],
          "newlines-between": "always",
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true
          }
        }
      ],
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error"
    },
    settings: {
      tailwindcss: {
        callees: ["classnames", "clsx", "cn", "tw"],
        config: "tailwind.config.ts",
      },
    },
  },
];

export default eslintConfig;
