import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

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
      ]
    }
  }
];
