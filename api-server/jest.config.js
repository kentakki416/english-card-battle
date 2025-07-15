/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/test/**/*.test.ts"], // テストファイルのパターンを指定
  
  // カバレッジ設定
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "text-summary", "html"],
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",  // エントリーポイントは除外
  ],
  // カバレッジ閾値は設定せず、情報表示のみ
  // coverageThreshold: {
  //   global: {
  //     branches: 40,
  //     functions: 40,
  //     lines: 40,
  //     statements: 40
  //   }
  // }
}
