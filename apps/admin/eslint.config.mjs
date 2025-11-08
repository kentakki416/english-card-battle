import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import tailwindcss from 'eslint-plugin-tailwindcss'
import perfectionist from 'eslint-plugin-perfectionist'
import baseConfig from '../../eslint.config.base.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      tailwindcss,
      perfectionist
    },
    rules: {
      // ベース設定を継承（quotes, semi, no-console, import/order）
      ...baseConfig.rules,
      
      // Tailwindcss固有のルール
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/enforces-negative-arbitrary-values': 'warn',
      'tailwindcss/enforces-shorthand': 'warn',
      'tailwindcss/migration-from-tailwind-2': 'warn',
      'tailwindcss/no-arbitrary-value': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': 'error',
      
      // Perfectionist（JSXプロパティのソート）
      'perfectionist/sort-jsx-props': [
        'error',
        {
          type: 'natural',
          order: 'asc'
        }
      ]
    },
    settings: {
      tailwindcss: {
        callees: ['classnames', 'clsx', 'cn', 'tw'],
        config: 'tailwind.config.ts',
      },
    },
  },
]

export default eslintConfig
