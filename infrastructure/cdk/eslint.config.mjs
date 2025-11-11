import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import baseConfig from '../../eslint.config.base.mjs'

export default tseslint.config(
  // 除外設定
  {
    ignores: [
      'cdk.out/**',
      'node_modules/**',
      'dist/**',
      '*.js',
      '*.d.ts',
      'coverage/**',
      'jest.config.js'
    ]
  },
  // ESLintの推奨設定
  js.configs.recommended,
  // TypeScript ESLintの推奨設定
  ...tseslint.configs.recommended,
  // グローバル変数設定
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  // importプラグイン設定
  {
    plugins: {
      import: importPlugin
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json'
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    }
  },
  // ベース設定をインポート
  baseConfig,
  // CDK固有のルール
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off' // CDKではconsole.logを許可
    }
  }
)

