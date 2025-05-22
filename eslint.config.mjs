import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
	{
		files: ["**/*.test.*", "**/*.spec.*"],
		ignores: true,
	},

	// Base JS/TS file matching
	{
		files: ["**/*.{js,mjs,cjs,ts,tsx}"],
		languageOptions: {
			globals: globals.browser,
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
				project: "./tsconfig.json", // Make sure this path is correct
			},
		},
	},

	// Custom rule overrides
	{
		rules: {
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
		},
	},
]);
