import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["js/**/*.{js,ts}"],
    languageOptions: {
      globals: globals.browser,
    },
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },
]);
