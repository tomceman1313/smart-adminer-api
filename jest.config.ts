import { pathsToModuleNameMapper } from "ts-jest";

const paths = {
	"@controllers/*": ["src/controllers/*"],
	"@services/*": ["src/services/*"],
	"@schema/*": ["src/schema/*"],
	"@routes/*": ["src/routes/*"],
	"types/*": ["src/types/*"],
	"@utils/*": ["src/utils/*"],
	"@config/*": ["src/config/*"],
	"@mocks/*": ["src/mocks/*"],
	"@src/*": ["src/*"],
};

export default {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "tsx", "js", "json"],
	verbose: true, // Enables detailed logs
	setupFiles: ["./jest.setup.ts"],
	moduleNameMapper: pathsToModuleNameMapper(paths, {
		prefix: "<rootDir>/",
	}),
	testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
};
