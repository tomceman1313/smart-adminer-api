export default {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "tsx", "js", "json"],
	verbose: true, // Enables detailed logs
	setupFiles: ["./jest.setup.ts"],
};
