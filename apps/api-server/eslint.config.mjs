import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import * as importPlugin from 'eslint-plugin-import'
import baseConfig from '../../eslint.config.base.mjs'

export default [
  {
    ignores: ['node_modules/*', 'dist/*', 'configdb/*', 'db/*', 'jest.config.js'],
  },
  {files: ['**/*.{js,mjs,cjs,ts}']},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
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
