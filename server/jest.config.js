export default {
  testEnvironment: "node",
  transform: {}, // Disable transformation for ESM
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: [
    "<rootDir>/src/tests/unit/**/*.test.js",
    "<rootDir>/src/tests/integration/**/*.test.js"
  ],
  setupFilesAfterEnv: ["./src/tests/setupTest.js"],
  globalTeardown: "./src/tests/teardownTest.js",
  verbose: true,
  testTimeout: 30000,
};
