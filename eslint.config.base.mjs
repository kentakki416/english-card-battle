// ベースESLint設定（Flat Config形式）
// すべてのアプリケーションで共通のルール

/** @type {import('eslint').Linter.FlatConfig} */
export default {
  rules: {
    // クォートをシングルクォートに統一
    'quotes': ['error', 'single'],
    // セミコロンを禁止
    'semi': ['error', 'never'],
    // console.logを禁止
    'no-console': 'error',
    // importの順序ルール（すべてのプロジェクトで共通）
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',    // Node.jsの組み込みモジュール
          'external',   // npmパッケージ
          'internal',   // 内部モジュール
          ['parent', 'sibling'], // 親・兄弟ディレクトリ
          'object',
          'type',
          'index'       // インデックスファイル
        ],
        'newlines-between': 'always',
        'pathGroupsExcludedImportTypes': ['builtin'],
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }
    ],
  }
}
