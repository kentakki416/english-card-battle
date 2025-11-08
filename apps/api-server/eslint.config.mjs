import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import pluginJs from '@eslint/js'
import * as importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import baseConfig from '../../eslint.config.base.mjs'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default [
  {
    ignores: ['node_modules/*', 'dist/*', 'configdb/*', 'db/*', 'jest.config.js'],
  },
  {files: ['**/*.{js,mjs,cjs,ts}']},
  {
    languageOptions: { 
      globals: globals.node,
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // TypeScript固有の設定（.tsファイルのみ）
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      }
    }
  },
  {
    plugins: { import: importPlugin },
    rules: {
      // ベース設定を継承（quotes, semi, no-console, import/order）
      ...baseConfig.rules,
      
      // API-server固有のルール
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          'prefer': 'no-type-imports',
          'disallowTypeAnnotations': false
        }
      ],
      'max-len': ['error', { 'code': 180 }],
    }
  }
]
