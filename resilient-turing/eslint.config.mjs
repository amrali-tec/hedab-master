import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    "node_modules/**",
    "build_cache/**",
    ".next/**",
    ".next_dev/**",
    ".next_dev_active/**",
    ".next_prod_build/**",
    ".next_out/**",
    ".next_trash/**",
    ".build_dist/**",
    "public/**",
    "scripts/**",
    "release/**",
    "backups/**",
    "gulf-hills-static/**",
    "out/**",
    "build/**",
    "scratch/**",
    "trash_temp/**",
    "data/**",
    "data_legacy_backup/**",
    "archive_trash/**",
    "**/._*",
    "._*",
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "prefer-const": "warn",
      "no-var": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-assign-module-variable": "warn",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
]);

export default eslintConfig;
