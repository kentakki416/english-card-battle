import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import * as tseslint from 'typescript-eslint'

export default defineConfig([
  // 除外設定を最初に追加
  {
    ignores: [
      'cdk.out/**',
      'node_modules/**',
      'dist/**',
      '*.js',
      '*.d.ts',
      'coverage/**',
      '*.min.js',
      'build/**',
      'temp/**',
      '.git/**'
    ]
  },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'computed-property-spacing': ['error', 'never'],
      'arrow-parens': ['error', 'always'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'no-multi-spaces': ['error'],
      'no-trailing-spaces': ['error'],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      // 追加のimport関連ルール
      'import/no-unresolved': 'error',
      'import/no-unused-modules': 'error',
      'import/no-duplicates': 'error',
    }
  }
])
