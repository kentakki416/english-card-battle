// @ts-check
import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import vitestPlugin from '@vitest/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import * as importPlugin from 'eslint-plugin-import';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const flatCompat = new FlatCompat();

export default tseslint.config(
    {
        // このオブジェクトは ignores プロパティだけにする必要あり
        ignores: ['dist', '.next'], // ESLint のチェック対象外 (node_modules と .git はデフォルトで対象外)
    },
    {
        languageOptions: {
            globals: globals.browser,
        },
    },
    // Shareable Configs を有効化
    eslint.configs.recommended,
    ...tseslint.configs.strict, // strict は recommended よりも厳しめな設定
    jsxA11yPlugin.flatConfigs.recommended,
    vitestPlugin.configs.recommended,
    jestDomPlugin.configs['flat/recommended'],
    // Flat Config 未対応のプラグインは FlatCompat を使用
    ...flatCompat.extends('plugin:react-hooks/recommended'),
    // ESLint v9 で削除された API "context.getScope" を内部で使用しているプラグインは fixupConfigRules で対応
    ...fixupConfigRules(
        flatCompat.extends(
            // "plugin:import/recommended", // TODO: 現時点だと色々動かないので eslint-plugin-import が Flat Config に対応したら有効化する
            'plugin:testing-library/react',
            'plugin:storybook/recommended',
        ),
    ),
    {
        // React の設定
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // React の基本的なルール
            'react/jsx-uses-react': 'off', // React 17+ では不要
            'react/react-in-jsx-scope': 'off', // React 17+ では不要
            'react/prop-types': 'off', // TypeScript で型チェックするため無効化
        },
    },
    {
        // eslint-plugin-react-hooks の設定
        rules: {
            'react-hooks/exhaustive-deps': 'error', // recommended では warn のため error に上書き
        },
    },
    {
        // eslint-plugin-import の設定
        plugins: { import: importPlugin },
        rules: {
            'import/order': [
                // import の並び順を設定
                'warn',
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
        // eslint-plugin-unused-imports の設定
        plugins: { 'unused-imports': unusedImportsPlugin },
        rules: {
            '@typescript-eslint/no-unused-vars': 'off', // 重複エラーを防ぐため typescript-eslint の方を無効化
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
        // @vitest/eslint-plugin の設定
        rules: {
            'vitest/consistent-test-it': ['error', { fn: 'test' }], // it ではなく test に統一
        },
    },
    {
        // eslint-plugin-perfectionist の設定
        plugins: { perfectionist: perfectionistPlugin },
        rules: {
            'perfectionist/sort-interfaces': 'warn', // interface のプロパティの並び順をアルファベット順に統一
            'perfectionist/sort-object-types': 'warn', // Object 型のプロパティの並び順をアルファベット順に統一
        },
    },
    {
        // console.log を禁止するルール
        rules: {
            'no-console': 'error', // console.log() などの console メソッドを禁止
        },
    },
    prettierConfig, // フォーマット は Prettier で行うため、フォーマット関連のルールを無効化
);
