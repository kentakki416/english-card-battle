import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"

export default [
  {
    ignores: ["node_modules/*", "dist/*", "configdb/*", "db/*"],
  },
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // import typeを禁止
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          "prefer": "no-type-imports",
          "disallowTypeAnnotations": false
        }
      ],
      // クォートをダブルクォートに統一
      "quotes": ["error", "double"],
      // 行の最大文字数を180文字に設定
      "max-len": ["error", { "code": 180 }],
      // セミコロンを禁止
      "semi": ["error", "never"]
    }
  }
]
