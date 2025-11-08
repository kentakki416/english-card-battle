import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import vitestPlugin from '@vitest/eslint-plugin'
import * as importPlugin from 'eslint-plugin-import'
import jestDomPlugin from 'eslint-plugin-jest-dom'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import perfectionistPlugin from 'eslint-plugin-perfectionist'
import tailwindcss from 'eslint-plugin-tailwindcss'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import baseConfig from '../../eslint.config.base.mjs'

const flatCompat = new FlatCompat()

export default tseslint.config(
    {
        ignores: ['dist', '.next'],
    },
    {
        languageOptions: {
            globals: globals.browser,
        },
    },
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    jsxA11yPlugin.flatConfigs.recommended,
    vitestPlugin.configs.recommended,
    jestDomPlugin.configs['flat/recommended'],
    ...flatCompat.extends('plugin:react-hooks/recommended'),
    ...fixupConfigRules(
        flatCompat.extends(
            'plugin:testing-library/react',
            'plugin:storybook/recommended',
        ),
    ),
    {
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
        },
    },
    {
        rules: {
            'react-hooks/exhaustive-deps': 'error',
        },
    },
    {
        plugins: { import: importPlugin },
        rules: {
            // ベース設定を継承（quotes, semi, no-console, import/order）
            ...baseConfig.rules,
            
            // React専用のimport/order拡張（reactを最初に）
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        ['parent', 'sibling'],
                        'object',
                        'type',
                        'index',
                    ],
                    'newlines-between': 'always',
                    pathGroupsExcludedImportTypes: ['builtin'],
                    alphabetize: { order: 'asc', caseInsensitive: true },
                    pathGroups: [
                        {
                            pattern: 'react',
                            group: 'external',
                            position: 'before',
                        },
                    ],
                },
            ],
        },
    },
    {
        plugins: { 'unused-imports': unusedImportsPlugin },
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        rules: {
            'vitest/consistent-test-it': ['error', { fn: 'test' }],
        },
    },
    {
        plugins: { perfectionist: perfectionistPlugin },
        rules: {
            'perfectionist/sort-interfaces': 'warn',
            'perfectionist/sort-object-types': 'warn',
        },
    },
    {
        plugins: { tailwindcss: tailwindcss },
        rules: {
            'tailwindcss/classnames-order': 'warn',
            'tailwindcss/enforces-negative-arbitrary-values': 'warn',
            'tailwindcss/enforces-shorthand': 'warn',
            'tailwindcss/migration-from-tailwind-2': 'warn',
            'tailwindcss/no-arbitrary-value': 'off',
            'tailwindcss/no-custom-classname': 'off',
            'tailwindcss/no-contradicting-classname': 'error',
            'tailwindcss/no-unnecessary-arbitrary-value': 'error',
        },
    },
)
