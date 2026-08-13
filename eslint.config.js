const json = require("@eslint/json").default;
const css = require("@eslint/css").default;

module.exports = [
  {
    ignores: ["node_modules/**", "**/node_modules/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    rules: {
      "json/no-duplicate-keys": "error",
    },
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    rules: {
      "css/no-duplicate-imports": "error",
    },
  },
];
