import js from "@eslint/js"
import prettier from "eslint-config-prettier/flat"
import importX from "eslint-plugin-import-x"
import tseslint from "typescript-eslint"

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "import-x": importX,
    },
    languageOptions: {
      globals: {
        fetch: false,
        Response: false,
        Request: false,
        addEventListener: false,
      },

      ecmaVersion: 2022,
      sourceType: "module",
    },

    rules: {
      curly: "error",
      quotes: [
        "error",
        "double",
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      semi: ["error", "never"],
      "no-debugger": ["error"],
      "no-implicit-globals": "error",
      "no-warning-comments": ["error", { terms: ["fixme", "todo"] }],
      "newline-before-return": "error",
      "padded-blocks": ["error", "never"],
      "space-before-blocks": "error",
      "linebreak-style": ["error", "unix"],

      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: [
            "break",
            "case",
            "cjs-export",
            "class",
            "continue",
            "do",
            "if",
            "switch",
            "try",
            "while",
            "return",
          ],
        },
        {
          blankLine: "always",
          prev: [
            "break",
            "case",
            "cjs-export",
            "class",
            "continue",
            "do",
            "if",
            "switch",
            "try",
            "while",
            "return",
          ],
          next: "*",
        },
      ],

      "no-empty": [
        "warn",
        {
          allowEmptyCatch: true,
        },
      ],

      "no-process-exit": "off",
      "no-useless-escape": "off",

      "prefer-const": [
        "warn",
        {
          destructuring: "all",
        },
      ],

      "import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import-x/no-duplicates": "error",

      "n/no-missing-import": "off",
      "n/no-missing-require": "off",
      "n/no-deprecated-api": "off",
      "n/no-unpublished-import": "off",
      "n/no-unpublished-require": "off",
      "n/no-unsupported-features/es-syntax": "off",
      "n/no-unsupported-features/node-builtins": "off",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-empty-function": [
        "error",
        {
          allow: ["arrowFunctions"],
        },
      ],
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  prettier,
]
