// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['node_modules/**', '.features-gen/**', 'playwright-report/**', 'test-results/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Not using eslint-plugin-playwright's `flat/recommended` preset: it assumes
    // assertions live inside test() blocks, but in this playwright-bdd project
    // assertions live in Page Object methods and step definitions instead —
    // that mismatch produces false positives (e.g. no-standalone-expect) rather
    // than useful signal. Cherry-picking the rules that are architecture-agnostic.
    files: ['tests/**/*.ts', 'features/**/*.ts', 'playwright.config.ts'],
    plugins: { playwright },
    rules: {
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-eval': 'error',
      'playwright/no-networkidle': 'error',
      'playwright/valid-expect': 'error',
      'playwright/prefer-web-first-assertions': 'error',
    },
  },
  prettierConfig
);
