import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
	{
		ignores: ["**/*.test.*", "**/*.spec.*"],
	},

	// Base JS/TS file matching
	{
		files: ["**/*.{js,mjs,cjs,ts,tsx}"],
		languageOptions: {
			globals: globals.browser,
			parser: tseslint.parser,
			parserOptions: {
				project: "./tsconfig.json",
			},
		},
		plugins: {
			js,
		},
		extends: ["js/recommended"],
	},

	// TypeScript-specific config without type checking
	tseslint.configs.recommended,

	// Type-aware linting using tsconfig.json
	tseslint.configs.recommendedTypeChecked,
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			parserOptions: {
				project: "./tsconfig.json",
			},
		},
	},

	// Custom rule overrides
	{
		rules: {
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
			],
		},
	},
]);
